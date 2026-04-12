"use client";

import { useMemo, useState } from "react";
import surveyData from "@/data/data.json";

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

const surveys = surveyData as SurveyItem[];

export default function StartSurveyPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, SurveyAnswer>>({});
  const [isComplete, setIsComplete] = useState(false);

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
        <h2 className="text-2xl font-bold text-emerald-700">Survey Completed</h2>
        <p className="mt-2 text-emerald-700">Thank you. Your responses have been recorded in this session.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-xl sm:p-8">
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
