import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronRight, Sun, Compass, Sparkles, Moon, MessageCircle, BookMarked } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/collect")({
  head: () => ({
    meta: [
      { title: "Collect — Sisi" },
      { name: "description", content: "Press today's moment into your book." },
    ],
  }),
  component: Collect,
});

const kinds = [
  { label: "Sign", icon: Sun, tone: "var(--color-mustard)" },
  { label: "Sync", icon: Compass, tone: "var(--color-sky)" },
  { label: "Wish", icon: Sparkles, tone: "var(--color-burgundy)" },
  { label: "Dream", icon: Moon, tone: "var(--color-sky)" },
  { label: "Thought", icon: MessageCircle, tone: "var(--color-moss)" },
  { label: "Memory", icon: BookMarked, tone: "var(--color-burgundy)" },
];

const recent = [
  { title: "Saw a white feather on my way to work.", when: "Today, 8:42 AM", glyph: "✦" },
  { title: "The interview went better than I expected.", when: "Yesterday, 3:11 PM", glyph: "❦" },
];

function Collect() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [kind, setKind] = useState<string | null>("Sign");
  const canSubmit = text.trim().length > 0 && kind;

  return (
    <PhoneFrame>
      <header className="pt-4 flex items-center justify-between">
        <Link to="/" className="p-1"><ArrowLeft className="h-5 w-5 text-ink" strokeWidth={1.4} /></Link>
        <h1 className="text-lg serif text-ink">Press a moment</h1>
        <span className="w-5" />
      </header>

      {/* Step 1 — Write */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between mb-2">
          <span className="small-caps" style={{ color: "var(--color-burgundy)" }}>1 · Write</span>
          <span className="text-[11px] text-sepia serif italic">{text.length}/280</span>
        </div>
        <div className="torn-note px-4 py-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 280))}
            placeholder="A white feather on the sidewalk. The song you wished for, on the radio…"
            rows={4}
            className="w-full bg-transparent outline-none serif italic text-[15px] text-ink placeholder:text-sepia/60 leading-relaxed resize-none"
          />
        </div>
      </div>

      {/* Step 2 — Tag */}
      <div className="mt-6">
        <span className="small-caps" style={{ color: "var(--color-burgundy)" }}>2 · What kind?</span>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {kinds.map(({ label, icon: Icon, tone }) => {
            const active = kind === label;
            return (
              <button
                key={label}
                onClick={() => setKind(label)}
                className="paper-card rounded-xl py-3 flex flex-col items-center gap-1 transition"
                style={{
                  borderColor: active ? tone : undefined,
                  boxShadow: active ? `inset 0 0 0 1.5px ${tone}` : undefined,
                  opacity: active ? 1 : 0.75,
                }}
              >
                <Icon className="h-4 w-4" strokeWidth={1.3} style={{ color: tone }} />
                <span className="serif italic text-[12px] text-ink">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3 — Press */}
      <button
        disabled={!canSubmit}
        onClick={() => {
          const title = text.trim().slice(0, 60);
          setText("");
          navigate({
            to: "/constellations",
            search: { landing: "1", title, kind: kind ?? "Sign" },
          });
        }}
        className="mt-6 w-full rounded-xl py-4 serif text-[16px] italic transition disabled:opacity-40"
        style={{
          backgroundColor: "var(--color-burgundy)",
          color: "var(--color-paper)",
          boxShadow: canSubmit ? "0 6px 18px -10px var(--color-burgundy)" : "none",
        }}
      >
        ❦  Press it into the book

      </button>

      <h2 className="small-caps mt-9 mb-3">Pressed earlier</h2>
      <div className="space-y-3">
        {recent.map((r) => (
          <div key={r.title} className="paper-card rounded-lg px-4 py-3 flex items-center gap-3">
            <div className="h-12 w-14 rounded bg-secondary flex items-center justify-center text-xl text-moss">
              {r.glyph}
            </div>
            <div className="flex-1 min-w-0">
              <p className="serif text-[14px] text-ink leading-snug">{r.title}</p>
              <p className="text-[11px] text-sepia mt-1 italic serif">{r.when}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-sepia/60" strokeWidth={1.3} />
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}
