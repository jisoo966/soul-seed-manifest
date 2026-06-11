import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Sun, Compass, Sparkles, Moon, MessageCircle, BookMarked } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/collect")({
  head: () => ({
    meta: [
      { title: "Collect — Sisi" },
      { name: "description", content: "Capture the meaningful moments of your day." },
    ],
  }),
  component: Collect,
});

const kinds = [
  { label: "A Sign", icon: Sun },
  { label: "A Synchronicity", icon: Compass },
  { label: "A Manifestation", icon: Sparkles },
  { label: "A Dream", icon: Moon },
  { label: "A Thought", icon: MessageCircle },
  { label: "A Memory", icon: BookMarked },
];

const recent = [
  { title: "Saw a white feather on my way to work.", when: "Today, 8:42 AM", glyph: "✦" },
  { title: "The interview went better than I expected.", when: "Yesterday, 3:11 PM", glyph: "❦" },
];

function Collect() {
  return (
    <PhoneFrame>
      <header className="pt-4 flex items-center justify-between">
        <Link to="/" className="p-1"><ArrowLeft className="h-5 w-5 text-ink" strokeWidth={1.4} /></Link>
        <h1 className="text-lg serif text-ink">Collect</h1>
        <span className="w-5" />
      </header>

      <p className="text-center mt-7 serif italic text-sepia">What happened today?</p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {kinds.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="paper-card rounded-xl py-5 flex flex-col items-center gap-2 hover:opacity-90 transition"
          >
            <Icon className="h-5 w-5 text-moss" strokeWidth={1.2} />
            <span className="serif text-[12px] text-ink text-center px-1 leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>

      <h2 className="small-caps mt-8 mb-3">Recent entries</h2>
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
