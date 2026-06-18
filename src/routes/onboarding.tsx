import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome — Sísí" },
      { name: "description", content: "A quiet beginning." },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [entry, setEntry] = useState("");

  function handlePlantAndGoHome() {
    if (typeof window !== "undefined") {
      const trimmed = name.trim();
      if (trimmed) window.localStorage.setItem("sisi:name", trimmed);
      if (entry.trim()) {
        const entries = JSON.parse(window.localStorage.getItem("sisi:entries") || "[]");
        entries.unshift({ id: Date.now(), text: entry.trim(), type: null, createdAt: new Date().toISOString() });
        window.localStorage.setItem("sisi:entries", JSON.stringify(entries));
      }
      window.localStorage.setItem("sisi:onboarded", "1");
    }
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-6 px-3 bg-background">
      <div
        className="relative w-full max-w-[420px] bg-paper sm:rounded-[2rem] overflow-hidden flex flex-col sm:border border-border"
        style={{ minHeight: "min(900px, 95vh)" }}
      >
        {/* status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 text-[11px] tracking-wide text-ink/60">
          <span>9:41</span>
          <button
            onClick={handlePlantAndGoHome}
            className="text-[11px] tracking-[0.2em] uppercase text-ink/40 hover:text-ink transition"
          >
            skip
          </button>
        </div>

        {step === 1 ? (
          // ── Step 1: hello + name ────────────────────────────
          <div className="flex flex-col items-center justify-center px-8 py-16 flex-1">
            <span className="text-2xl mb-12" style={{ color: "var(--color-gold)" }}>✦</span>

            <p className="text-2xl serif italic text-ink mb-2">hi.</p>
            <p className="serif italic text-ink/80 text-base mb-12 text-center">
              i'm sísí. i keep what stays with you.
            </p>

            <label className="small-caps text-xs text-ink/50 mb-2">
              what should i call you?
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep(2)}
              className="bg-transparent border-b border-ink/30 text-center text-lg serif italic py-2 mb-12 focus:outline-none focus:border-gold w-full max-w-[200px]"
              style={{ color: "var(--color-ink)" }}
              autoFocus
            />

            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="text-lg serif italic disabled:opacity-30 transition-opacity"
              style={{ color: "var(--color-oxblood)" }}
            >
              →
            </button>
          </div>
        ) : (
          // ── Step 2: first entry ─────────────────────────────
          <div className="flex flex-col px-8 py-16 flex-1">
            <p className="text-2xl serif italic text-ink mb-8">hi, {name}.</p>

            <label className="small-caps text-xs text-ink/50 mb-3">
              what's on your mind today?
            </label>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              rows={6}
              className="bg-transparent border-b border-ink/30 text-base serif text-ink py-2 mb-8 resize-none focus:outline-none focus:border-gold w-full"
              style={{ color: "var(--color-ink)" }}
              autoFocus
            />

            <button
              onClick={handlePlantAndGoHome}
              disabled={!entry.trim()}
              className="text-lg serif italic disabled:opacity-30 transition-opacity self-end"
              style={{ color: "var(--color-oxblood)" }}
            >
              plant ✦
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
