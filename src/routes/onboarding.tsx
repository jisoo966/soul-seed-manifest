import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";


export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome — Sisi" },
      { name: "description", content: "A quiet beginning." },
    ],
  }),
  component: Onboarding,
});

type Step = {
  caps: string;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    caps: "Welcome",
    title: "A quieter\nkind of journal.",
    body: "One small entry a day. No streaks, no notifications shouting at you.",
  },
  {
    caps: "One line a day",
    title: "Begin with\na single line.",
    body: "A prompt arrives each morning. Answer in a sentence, or a paragraph. Whatever fits.",
  },
  {
    caps: "Letters back",
    title: "Receive quiet\nletters from\nyourself.",
    body: "Sisi gathers your words and sends gentle reflections — never advice, only echoes.",
  },
  {
    caps: "Patterns",
    title: "Notice what\nstays with you.",
    body: "Over time, recurring themes surface softly. Yours alone to read.",
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [name, setName] = useState("");
  const nameStep = i === steps.length;
  const last = i === steps.length - 1;
  const step = steps[i];

  const finish = () => {
    if (typeof window !== "undefined") {
      const trimmed = name.trim();
      if (trimmed) window.localStorage.setItem("sisi:name", trimmed);
      window.localStorage.setItem("sisi:onboarded", "1");
    }
    navigate({ to: "/" });
  };

  const next = () => {
    if (nameStep) finish();
    else setI((n) => n + 1);
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center py-6 px-3 bg-background">
      <div
        className="relative w-full max-w-[420px] bg-paper rounded-[2rem] overflow-hidden flex flex-col border border-border"
        style={{ minHeight: "min(900px, 95vh)" }}
      >
        {/* status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 text-[11px] tracking-wide text-ink/60">
          <span>9:41</span>
          <button
            onClick={finish}
            className="text-[11px] tracking-[0.2em] uppercase text-sepia hover:text-ink transition"
          >
            Skip
          </button>
        </div>

        {/* content */}
        <div className="flex-1 flex flex-col px-8 pt-12 pb-10">
          {nameStep ? (
            <>
              <p className="small-caps">One last thing</p>
              <h1 className="mt-6 serif text-[2.25rem] leading-[1.1] text-ink">
                How should I{"\n"}call you?
              </h1>
              <div className="mt-8 ink-divider" />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  finish();
                }}
                className="mt-8"
              >
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-transparent outline-none serif text-[1.5rem] text-ink placeholder:text-sepia/40 border-b border-border py-2 focus:border-ink transition-colors"
                />
                <p className="mt-3 text-[11px] text-sepia tracking-wide">
                  You can change this later.
                </p>
              </form>
            </>
          ) : (
            <>
              <p className="small-caps">{step.caps}</p>
              <h1 className="mt-6 serif text-[2.25rem] leading-[1.1] text-ink whitespace-pre-line">
                {step.title}
              </h1>
              <div className="mt-8 ink-divider" />
              <p className="mt-8 serif text-[1.05rem] leading-[1.5] text-ink/80">
                {step.body}
              </p>
            </>
          )}

          <div className="mt-auto pt-12">
            {/* progress dots */}
            <div className="flex items-center gap-2 mb-8">
              {[...steps, { caps: "name" }].map((_, idx) => (
                <span
                  key={idx}
                  className="h-[2px] flex-1 transition-opacity"
                  style={{
                    background: "var(--color-ink)",
                    opacity: idx === i ? 1 : 0.15,
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={nameStep && !name.trim()}
              className="w-full block text-center py-4 border border-ink text-ink serif text-[14px] tracking-[0.05em] hover:bg-ink hover:text-paper transition rounded-md disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
            >
              {nameStep ? "Begin" : last ? "Almost there" : "Continue"}
            </button>

            {!nameStep && (
              <button
                onClick={() => setI((n) => Math.max(0, n - 1))}
                disabled={i === 0}
                className="mt-4 w-full text-[11px] tracking-[0.22em] uppercase text-sepia hover:text-ink disabled:opacity-30 transition"
              >
                ← Back
              </button>
            )}

            {nameStep && (
              <p className="mt-6 text-center text-[11px] text-sepia tracking-wide">
                little by little, day by day.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

