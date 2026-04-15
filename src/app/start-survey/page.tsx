"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import surveyData from "@/data/data.json";

const LIKERT_MAX_DIFFERENCE = 4;
const RANDOM_BASELINE_STORAGE_KEY = "image-sense-random-baseline-v1";
const USER_SUBMISSIONS_STORAGE_KEY = "image-sense-user-submissions-v1";
const RANDOM_BASELINE_SIZE = 200;
const RANDOM_BASELINE_SEED = 20260415;

type StarQuestion = {
  id: string;
  question: string;
  scale: number[];
};

type MultipleQuestion = {
  question: string;
  required: boolean;
  options: string[];
};

type SurveyItem = {
  id: number;
  question: string;
  image: string;
  starQuestions: StarQuestion[];
  multipleQuestion: MultipleQuestion;
};

type SurveyAnswer = {
  starRatings: Record<string, number>;
  creatorChoice: string;
};

type FlattenedRatings = Record<string, number>;

type SubmissionRecord = {
  submittedAt: string;
  ratings: FlattenedRatings;
};

type SimilarityResult = {
  similarityPercentage: number;
  interpretation: string;
};

const surveys = surveyData as SurveyItem[];

const clampLikertValue = (value: number) => Math.max(1, Math.min(5, value));

const getRatingKey = (surveyId: number, starQuestionId: string) => `${surveyId}:${starQuestionId}`;

const flattenRatings = (responses: Record<number, SurveyAnswer>): FlattenedRatings => {
  const ratings: FlattenedRatings = {};

  for (const survey of surveys) {
    const surveyAnswer = responses[survey.id];

    if (!surveyAnswer) {
      continue;
    }

    for (const starQuestion of survey.starQuestions) {
      const selected = surveyAnswer.starRatings[starQuestion.id];

      if (typeof selected === "number") {
        ratings[getRatingKey(survey.id, starQuestion.id)] = clampLikertValue(selected);
      }
    }
  }

  return ratings;
};

const createSeededRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const getAllQuestionKeys = () => {
  const keys: string[] = [];

  for (const survey of surveys) {
    for (const starQuestion of survey.starQuestions) {
      keys.push(getRatingKey(survey.id, starQuestion.id));
    }
  }

  return keys;
};

const buildRandomBaseline = (): SubmissionRecord[] => {
  const random = createSeededRandom(RANDOM_BASELINE_SEED);
  const questionKeys = getAllQuestionKeys();
  const baseline: SubmissionRecord[] = [];

  for (let i = 0; i < RANDOM_BASELINE_SIZE; i += 1) {
    const ratings: FlattenedRatings = {};

    for (const key of questionKeys) {
      ratings[key] = Math.floor(random() * 5) + 1;
    }

    baseline.push({
      submittedAt: `baseline-${i + 1}`,
      ratings,
    });
  }

  return baseline;
};

const isValidSubmissionRecord = (entry: unknown): entry is SubmissionRecord => {
  if (!entry || typeof entry !== "object") {
    return false;
  }

  const candidate = entry as { submittedAt?: unknown; ratings?: unknown };
  return (
    typeof candidate.submittedAt === "string" &&
    Boolean(candidate.ratings) &&
    typeof candidate.ratings === "object" &&
    !Array.isArray(candidate.ratings)
  );
};

const readSubmissionList = (storageKey: string): SubmissionRecord[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidSubmissionRecord);
  } catch {
    return [];
  }
};

const saveSubmissionList = (storageKey: string, submissions: SubmissionRecord[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(submissions));
};

const readOrCreateRandomBaseline = (): SubmissionRecord[] => {
  const storedBaseline = readSubmissionList(RANDOM_BASELINE_STORAGE_KEY);

  if (storedBaseline.length > 0) {
    return storedBaseline;
  }

  const generated = buildRandomBaseline();
  saveSubmissionList(RANDOM_BASELINE_STORAGE_KEY, generated);
  return generated;
};

const readStoredUserSubmissions = () => readSubmissionList(USER_SUBMISSIONS_STORAGE_KEY);

const saveStoredUserSubmissions = (submissions: SubmissionRecord[]) => {
  saveSubmissionList(USER_SUBMISSIONS_STORAGE_KEY, submissions);
};

const getSimilarityInterpretation = (percentage: number) => {
  if (percentage >= 80) {
    return "Strong alignment with global perception";
  }
  if (percentage >= 60) {
    return "Moderate alignment";
  }
  if (percentage >= 40) {
    return "Partial divergence";
  }
  return "Significant divergence";
};

const calculateSimilarity = (
  currentRatings: FlattenedRatings,
  allSubmissions: SubmissionRecord[],
): SimilarityResult | null => {
  const questionKeys = Object.keys(currentRatings);

  if (questionKeys.length === 0 || allSubmissions.length === 0) {
    return null;
  }

  const globalAverages: Record<string, number> = {};

  for (const key of questionKeys) {
    const values = allSubmissions
      .map((submission) => submission.ratings[key])
      .filter((value): value is number => typeof value === "number");

    if (values.length === 0) {
      continue;
    }

    const sum = values.reduce((acc, value) => acc + value, 0);
    globalAverages[key] = sum / values.length;
  }

  const similarities = questionKeys
    .map((key) => {
      const userValue = currentRatings[key];
      const globalAverage = globalAverages[key];

      if (typeof globalAverage !== "number") {
        return null;
      }

      const absoluteDifference = Math.abs(userValue - globalAverage);
      const normalizedDifference = absoluteDifference / LIKERT_MAX_DIFFERENCE;
      return 1 - normalizedDifference;
    })
    .filter((value): value is number => typeof value === "number");

  if (similarities.length === 0) {
    return null;
  }

  const overallSimilarity = similarities.reduce((acc, value) => acc + value, 0) / similarities.length;
  const similarityPercentage = overallSimilarity * 100;

  return {
    similarityPercentage,
    interpretation: getSimilarityInterpretation(similarityPercentage),
  };
};

export default function StartSurveyPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, SurveyAnswer>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [similarityResult, setSimilarityResult] = useState<SimilarityResult | null>(null);

  const currentSurvey = surveys[currentIndex];

  const currentAnswer = useMemo(() => {
    return (
      answers[currentSurvey?.id] ?? {
        starRatings: {},
        creatorChoice: "",
      }
    );
  }, [answers, currentSurvey?.id]);

  if (!currentSurvey) {
    return (
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-5 text-left text-red-700">
        No survey data found.
      </section>
    );
  }

  const updateStarRating = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentSurvey.id]: {
        ...currentAnswer,
        starRatings: {
          ...currentAnswer.starRatings,
          [questionId]: value,
        },
      },
    }));
  };

  const updateCreatorChoice = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentSurvey.id]: {
        ...currentAnswer,
        creatorChoice: value,
      },
    }));
  };

  const allStarsAnswered = currentSurvey.starQuestions.every(
    (sq) => currentAnswer.starRatings[sq.id] >= 1,
  );
  const creatorAnswered = currentAnswer.creatorChoice.length > 0;
  const canContinue = allStarsAnswered && creatorAnswered;

  const handleNext = () => {
    if (!canContinue) return;

    if (currentIndex === surveys.length - 1) {
      const currentRatings = flattenRatings(answers);
      const baselineSubmissions = readOrCreateRandomBaseline();
      const previousUserSubmissions = readStoredUserSubmissions();
      const updatedUserSubmissions: SubmissionRecord[] = [
        ...previousUserSubmissions,
        {
          submittedAt: new Date().toISOString(),
          ratings: currentRatings,
        },
      ];
      const globalSubmissions = [...baselineSubmissions, ...updatedUserSubmissions];

      saveStoredUserSubmissions(updatedUserSubmissions);
      setSimilarityResult(calculateSimilarity(currentRatings, globalSubmissions));
      setIsComplete(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((prev) => prev - 1);
  };

  if (isComplete) {
    return (
      <section className="mx-auto w-full max-w-3xl rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mb-4 flex justify-end">
          <Link
            href="/"
            className="rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 hover:text-emerald-800"
          >
            Home
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-emerald-700">Survey Completed</h2>
        <p className="mt-2 text-emerald-700">Thank you. Your responses have been recorded.</p>
        {similarityResult ? (
          <div className="mx-auto mt-6 max-w-md rounded-2xl border border-emerald-200 bg-white p-5 text-left">
            <h3 className="text-lg font-semibold text-slate-800">Perceptual Alignment Result</h3>
            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {similarityResult.similarityPercentage.toFixed(2)}%
            </p>
            <p className="mt-2 text-sm text-slate-600">{similarityResult.interpretation}</p>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-xl sm:p-8">
      <div className="mb-4 flex justify-end">
        <Link
          href="/"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
        >
          Home
        </Link>
      </div>
      <header className="mb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Question {currentIndex + 1} of {surveys.length}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">{currentSurvey.question}</h1>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
        <img
          src={currentSurvey.image}
          alt={`Survey visual ${currentSurvey.id}`}
          className="h-auto max-h-96 w-full rounded-xl object-contain"
        />
      </div>

      <div className="mt-6 space-y-5">
        {currentSurvey.starQuestions.map((sq) => {
          const selected = currentAnswer.starRatings[sq.id];

          return (
            <div key={sq.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="mb-3 text-base font-semibold text-slate-700">{sq.question}</p>
              <div className="flex flex-wrap items-center gap-2">
                {sq.scale.map((value) => {
                  const active = (selected ?? 0) >= value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateStarRating(sq.id, value)}
                      aria-label={`${value} star${value > 1 ? "s" : ""}`}
                      title={`${value} star${value > 1 ? "s" : ""}`}
                      className={`rounded-lg border px-3 py-2 text-2xl leading-none transition ${
                        active
                          ? "border-amber-300 bg-amber-50 text-amber-500"
                          : "border-slate-300 bg-white text-slate-300 hover:border-amber-300 hover:text-amber-400"
                      }`}
                    >
                      ★
                    </button>
                  );
                })}
                <span className="ml-2 text-sm font-medium text-slate-600">
                  {selected ? `${selected}/5` : "Not rated"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 p-4">
        <p className="mb-3 text-base font-semibold text-slate-700">{currentSurvey.multipleQuestion.question}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {currentSurvey.multipleQuestion.options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 hover:border-blue-300"
            >
              <input
                type="radio"
                name={`creator-${currentSurvey.id}`}
                value={option}
                checked={currentAnswer.creatorChoice === option}
                onChange={() => updateCreatorChoice(option)}
              />
              <span className="text-slate-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <footer className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canContinue}
          className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {currentIndex === surveys.length - 1 ? "Submit" : "Next"}
        </button>
      </footer>
    </section>
  );
}
