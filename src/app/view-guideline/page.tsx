import Link from "next/link";

const headlineStats = [
  { value: "82.7%", label: "say AI speeds up design work" },
  { value: "64.3%", label: "believe AI can be creative" },
  { value: "54.1%", label: "prefer AI as a support tool" },
  { value: "#1 gap", label: "emotional depth (AI scores lowest)" },
];

type Guideline = {
  id: number;
  title: string;
  principle: string;
  details: string;
  researchBasis: string;
};

type GuidelineGroup = {
  code: string;
  title: string;
  items: Guideline[];
};

const guidelineGroups: GuidelineGroup[] = [
  {
    code: "A",
    title: "Creativity",
    items: [
      {
        id: 1,
        title: "Start with your own concept - use AI to execute, not conceive",
        principle:
          "Participants consistently rated creativity higher in designs that showed clear human ideation behind them.",
        details:
          "AI-generated visuals scored moderately on creativity but were described as lacking uniqueness and variation. Your creative direction must come first; let AI render or iterate on what you already imagined.",
        researchBasis:
          "Creativity ratings favored designs with visible human intent. Qualitative feedback cited repetitive patterns as the top creativity weakness of AI outputs.",
      },
      {
        id: 2,
        title: "Review multiple AI variations and curate - never use the first output",
        principle:
          "The research highlighted AI's strength in generating multiple variations quickly.",
        details:
          "Generate a wide set, then apply your own judgment to select, combine, and refine. The human role has shifted from sole creator to curator, so treat curation as a creative act, not a shortcut.",
        researchBasis:
          "Findings referenced prior work showing best results when AI handled generation and humans made final artistic choices.",
      },
    ],
  },
  {
    code: "B",
    title: "Emotional Impact",
    items: [
      {
        id: 3,
        title: "Manually inject emotional intent - AI cannot feel what your audience feels",
        principle:
          "Emotional impact was the criterion where AI-generated designs scored lowest across participants.",
        details:
          "Respondents described purely AI-generated visuals as visually correct but emotionally neutral and emotionally flat. Before finalizing any image, ask what the viewer should feel. Then adjust color, composition, and subject matter to deliver that feeling.",
        researchBasis:
          "Emotional impact was the most cited weakness in open-ended responses. Designs with visible human influence scored significantly higher.",
      },
      {
        id: 4,
        title: "Embed cultural and contextual meaning yourself",
        principle:
          "Participants noted AI frequently misses cultural references, symbolic meaning, and contextual appropriateness.",
        details:
          "If your image targets a specific audience, community, or context, you must supply that meaning through prompt writing, post-editing, and final review. AI cannot reliably infer it.",
        researchBasis:
          "Limited cultural and contextual understanding ranked among the top three AI weaknesses in qualitative feedback.",
      },
    ],
  },
  {
    code: "C",
    title: "Trustworthiness",
    items: [
      {
        id: 5,
        title: "Be transparent about AI involvement in your design process",
        principle:
          "Trust was tied to whether designs felt reliable, authentic, and intentionally curated.",
        details:
          "Participants expressed lower trust when AI involvement was unclear. Disclose that AI was used as a tool and show the human refinement applied.",
        researchBasis:
          "81 of 97 participants agreed AI makes design faster, yet trust still depended on perceived human involvement.",
      },
      {
        id: 6,
        title: "Always review AI outputs for logical and detail-level accuracy",
        principle:
          "AI can produce plausible visuals that contain factual or logical errors.",
        details:
          "Check for distorted text, anatomical mistakes, misleading symbols, and contextually wrong details. Build this review into every AI-assisted workflow before publication.",
        researchBasis:
          "Visual errors and contextual misinterpretation were repeatedly cited as trust-reducing factors.",
      },
    ],
  },
  {
    code: "D",
    title: "Aesthetic Appeal and Professionalism",
    items: [
      {
        id: 7,
        title: "Use AI for technical polish - but guard against visual homogenization",
        principle:
          "Participants appreciated AI polish such as clean layouts, balanced color, and structural harmony.",
        details:
          "Overly uniform styles reduced long-term visual interest. Use AI to raise technical quality, then add deliberate variation, imperfection, or personality.",
        researchBasis:
          "Aesthetic appeal scored moderate-to-high, but repetitive homogeneous style was the second most cited weakness.",
      },
      {
        id: 8,
        title: "Apply human refinement before any professional deployment",
        principle:
          "Many respondents said AI-assisted designs looked clean and usable, but still required human refinement.",
        details:
          "Treat AI output as a strong draft, not a final deliverable. Final layout adjustments, typography choices, and context checks should be made by a human.",
        researchBasis:
          "Professionalism ratings were positive for technical cleanliness, but participants consistently flagged the need for human review before deployment.",
      },
    ],
  },
  {
    code: "E",
    title: "Responsible and Ethical Use",
    items: [
      {
        id: 9,
        title: "Avoid over-reliance - preserve your own creative muscle",
        principle:
          "A recurring concern was over-dependence on AI and gradual erosion of independent creativity.",
        details:
          "Deliberately practice design tasks without AI assistance. Use AI for repetitive or exploratory work, not as the default start point for every project.",
        researchBasis:
          "Avoiding over-reliance was identified as essential to maintaining originality in the Human-AI Design Balance Framework.",
      },
      {
        id: 10,
        title: "Understand the tool before using it professionally",
        principle:
          "Designers should know basic AI image-generation strengths and limitations before professional use.",
        details:
          "Knowing speed and variation benefits, plus emotional, cultural, and originality limits, helps you compensate for weaknesses rather than delivering them to clients.",
        researchBasis:
          "Multiple responses recommended AI literacy as a prerequisite to reduce contextual inaccuracies and ethical risks.",
      },
    ],
  },
];

const quickDo = [
  "Start with your own concept before prompting AI",
  "Curate and refine AI outputs - never use the first result",
  "Add emotional intent and cultural meaning manually",
  "Review every output for logical and detail accuracy",
  "Disclose AI involvement clearly and honestly",
  "Treat AI as your execution assistant, not your creative director",
];

const quickAvoid = [
  "Publishing AI output without human review",
  "Relying on AI to decide emotional tone",
  "Using AI as the default start point for every project",
  "Ignoring cultural or contextual fit",
  "Over-dependence that erodes design skills",
  "Assuming visual polish means contextual correctness",
];

export default function ViewGuidelinePage() {
  return (
    <section className="glass-panel fade-rise mx-auto w-full max-w-6xl rounded-4xl p-5 text-left sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700/80 sm:text-sm">
          Responsible AI Image-Making
        </p>
        <Link
          href="/"
          className="rounded-xl border border-cyan-300/80 bg-white/80 px-4 py-2 text-sm font-semibold text-cyan-800 transition hover:-translate-y-0.5 hover:border-cyan-500"
        >
          Home
        </Link>
      </div>

      <header className="rounded-3xl border border-cyan-100/90 bg-white/75 p-4 shadow-[0_10px_22px_rgba(2,132,199,0.08)] sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Guidelines for Visual Designers</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-4xl">
          Human-AI Design Balance Framework
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600 sm:text-base">
          Based on User Perception of AI-Generated vs. Human-Designed Visual Interfaces, Chapter 4 findings.
          Evaluation data included 97 participants, 5 criteria, and 12 visual samples.
        </p>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {headlineStats.map((stat) => (
          <article
            key={stat.value}
            className="rounded-2xl border border-cyan-100 bg-white/80 p-4 shadow-[0_8px_18px_rgba(2,132,199,0.08)]"
          >
            <p className="text-2xl font-bold text-teal-700">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 space-y-6">
        {guidelineGroups.map((group) => (
          <article key={group.code} className="rounded-3xl border border-white/70 bg-white/65 p-4 sm:p-6">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {group.code}. {group.title}
            </h2>

            <div className="mt-4 space-y-4">
              {group.items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-cyan-100/80 bg-white/85 p-4">
                  <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                    {item.id}. {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base">{item.principle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">{item.details}</p>
                  <p className="mt-3 rounded-xl bg-sky-50/80 p-3 text-xs leading-5 text-sky-900 sm:text-sm">
                    <span className="font-semibold">Research basis:</span> {item.researchBasis}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-cyan-100 bg-white/80 p-4 sm:p-6">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Quick Reference: Do and Avoid</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
            <h3 className="text-lg font-semibold text-emerald-800">DO</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-emerald-900 sm:text-base">
              {quickDo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
            <h3 className="text-lg font-semibold text-rose-800">AVOID</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-rose-900 sm:text-base">
              {quickAvoid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <p className="mt-8 text-sm leading-6 text-slate-600 sm:text-base">
        These guidelines reflect the Human-AI Design Balance Framework proposed in this research.
        AI performs strongly in speed, consistency, and aesthetic execution.
        Human designers remain essential for emotional resonance, originality, trustworthiness, and contextual meaning.
      </p>
    </section>
  );
}
