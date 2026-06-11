import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/constellations")({
  head: () => ({
    meta: [
      { title: "Constellations — Sisi" },
      { name: "description", content: "A scrapbook board of everything you've pressed in." },
    ],
  }),
  component: Constellations,
});

type Shape = "polaroid" | "torn" | "cloud" | "ribbon" | "ticket" | "pennant";
type Tone = "paper" | "moss" | "sky" | "mustard" | "burgundy";

type Card = {
  id: string;
  kind: string;
  title: string;
  note: string;
  date: string;
  shape: Shape;
  tone: Tone;
  x: number; // %
  y: number; // %
  rot: number; // deg
  w: number; // %
};

const boards = ["Relationship", "Career", "Self"] as const;

const cards: Card[] = [
  { id: "1", kind: "Sign", title: "white feather", note: "Saw a white feather on my way to work.", date: "Jun 10", shape: "pennant", tone: "mustard", x: 22, y: 12, rot: -6, w: 42 },
  { id: "2", kind: "Dream", title: "the open door", note: "I dreamt the door was already open. I just had to walk.", date: "Jun 08", shape: "cloud", tone: "sky", x: 68, y: 16, rot: 5, w: 44 },
  { id: "3", kind: "Memory", title: "morning light", note: "The cafe by the river. We sat without speaking for an hour.", date: "Jun 05", shape: "polaroid", tone: "paper", x: 18, y: 42, rot: 4, w: 40 },
  { id: "4", kind: "Wish", title: "to feel chosen", note: "You said you wanted to feel chosen. I want to remember this.", date: "Jun 02", shape: "ribbon", tone: "burgundy", x: 62, y: 48, rot: -4, w: 48 },
  { id: "5", kind: "Thought", title: "slow arrival", note: "Some things arrive slowly. That isn't the same as never.", date: "May 30", shape: "torn", tone: "moss", x: 26, y: 72, rot: -3, w: 46 },
  { id: "6", kind: "Sync", title: "the song", note: "The song I'd been thinking of, on the radio. Twice.", date: "May 27", shape: "ticket", tone: "paper", x: 70, y: 78, rot: 6, w: 40 },
];

// edges between cards that share a "thread"
const threads: Array<[string, string]> = [
  ["1", "2"],
  ["3", "4"],
  ["4", "5"],
  ["2", "6"],
];

function toneVar(t: Tone) {
  return {
    paper: "var(--color-paper)",
    moss: "oklch(0.86 0.05 145)",
    sky: "oklch(0.84 0.04 240)",
    mustard: "oklch(0.88 0.09 85)",
    burgundy: "oklch(0.78 0.08 25)",
  }[t];
}

function Constellations() {
  const [board, setBoard] = useState<typeof boards[number]>("Relationship");
  const [open, setOpen] = useState<Card | null>(null);

  const byId = Object.fromEntries(cards.map((c) => [c.id, c]));

  return (
    <PhoneFrame>
      <header className="pt-4 flex items-center justify-between">
        <Link to="/" className="p-1"><ArrowLeft className="h-5 w-5 text-ink" strokeWidth={1.4} /></Link>
        <h1 className="text-lg serif text-ink">Constellations</h1>
        <button className="p-1"><Plus className="h-5 w-5 text-ink" strokeWidth={1.4} /></button>
      </header>

      <p className="small-caps text-center mt-5" style={{ color: "var(--color-burgundy)" }}>
        scrapbook · vol. iv
      </p>
      <p className="text-center mt-1 serif italic text-[15px] text-ink">
        Everything you've pressed about <em>{board.toLowerCase()}</em>.
      </p>

      {/* board switch chips */}
      <div className="mt-4 flex gap-2 justify-center">
        {boards.map((b) => {
          const active = b === board;
          return (
            <button
              key={b}
              onClick={() => setBoard(b)}
              className="px-3 py-1 rounded-full serif text-[12px] transition"
              style={{
                backgroundColor: active ? "var(--color-burgundy)" : "transparent",
                color: active ? "var(--color-paper)" : "var(--color-ink)",
                border: `1px solid var(--color-burgundy)`,
                opacity: active ? 1 : 0.6,
              }}
            >
              {b}
            </button>
          );
        })}
      </div>

      {/* the board */}
      <div className="celestial relative mt-5 rounded-2xl aspect-[3/4] overflow-hidden border" style={{ borderColor: "var(--color-burgundy)" }}>
        {/* threads between cards */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {threads.map(([a, b], i) => {
            const A = byId[a], B = byId[b];
            return (
              <line
                key={i}
                x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke="oklch(0.78 0.08 25)"
                strokeOpacity={0.45}
                strokeWidth={0.4}
                strokeDasharray="0.8 1.2"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => setOpen(c)}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition hover:scale-[1.04] hover:z-20"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: `${c.w}%`,
              transform: `translate(-50%,-50%) rotate(${c.rot}deg)`,
              filter: "drop-shadow(0 6px 10px oklch(0 0 0 / 0.35))",
            }}
          >
            <Sticker card={c} />
          </button>
        ))}

        {/* tiny stars */}
        <span className="absolute top-3 left-4 text-[10px]" style={{ color: "var(--color-mustard)", opacity: 0.6 }}>✦</span>
        <span className="absolute bottom-4 right-5 text-[10px]" style={{ color: "var(--color-mustard)", opacity: 0.6 }}>✦</span>
        <span className="absolute top-1/2 right-3 text-[8px]" style={{ color: "var(--color-paper)", opacity: 0.4 }}>·</span>
      </div>

      <p className="mt-3 text-center text-[11px] serif italic text-sepia">
        tap a card to look closer
      </p>

      {/* zoom-in modal */}
      {open && (
        <div
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ backgroundColor: "oklch(0.15 0.02 60 / 0.85)", backdropFilter: "blur(4px)" }}
        >
          <button
            onClick={() => setOpen(null)}
            className="absolute top-6 right-6 p-2 rounded-full"
            style={{ backgroundColor: "var(--color-paper)", color: "var(--color-ink)" }}
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <div
            className="w-full max-w-[320px]"
            style={{ animation: "stickerIn 380ms cubic-bezier(.2,.9,.3,1.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Sticker card={{ ...open, w: 100 }} expanded />
            <div className="mt-4 text-center">
              <p className="small-caps" style={{ color: "var(--color-mustard)" }}>{open.kind} · {open.date}</p>
              <p className="mt-2 serif italic text-[15px]" style={{ color: "var(--color-paper)" }}>
                "{open.note}"
              </p>
            </div>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}

function Sticker({ card, expanded = false }: { card: Card; expanded?: boolean }) {
  const bg = toneVar(card.tone);
  const ink = "var(--color-ink)";
  const titleClass = expanded ? "text-[16px]" : "text-[11px]";
  const base = "relative serif text-center px-3 py-3 leading-tight";

  switch (card.shape) {
    case "polaroid":
      return (
        <div className="paper-card rounded-sm p-1.5 pb-5" style={{ backgroundColor: bg }}>
          <div className="aspect-[5/4] rounded-sm flex items-center justify-center" style={{ backgroundColor: "oklch(0.88 0.03 70)" }}>
            <span className="text-2xl" style={{ color: "var(--color-moss)" }}>❦</span>
          </div>
          <p className={`mt-2 italic ${titleClass}`} style={{ color: ink }}>{card.title}</p>
        </div>
      );
    case "torn":
      return (
        <div className={`torn-note ${base}`} style={{ backgroundColor: bg }}>
          <p className={`italic ${titleClass}`} style={{ color: ink }}>{card.title}</p>
        </div>
      );
    case "cloud":
      return (
        <div
          className={base}
          style={{
            backgroundColor: bg,
            borderRadius: "50% 45% 55% 50% / 60% 55% 50% 50%",
            border: "1px solid oklch(0.55 0.03 70 / 0.4)",
          }}
        >
          <p className={`italic ${titleClass}`} style={{ color: ink }}>{card.title}</p>
        </div>
      );
    case "ribbon":
      return (
        <div className="relative px-4 py-3" style={{ backgroundColor: bg }}>
          <span className="absolute left-0 top-0 h-full w-2" style={{ backgroundColor: "var(--color-burgundy)" }} />
          <p className={`italic serif ${titleClass}`} style={{ color: ink }}>{card.title}</p>
        </div>
      );
    case "ticket":
      return (
        <div
          className={base}
          style={{
            backgroundColor: bg,
            borderTop: "1px dashed var(--color-burgundy)",
            borderBottom: "1px dashed var(--color-burgundy)",
          }}
        >
          <p className={`italic ${titleClass}`} style={{ color: ink }}>{card.title}</p>
        </div>
      );
    case "pennant":
      return (
        <div
          className="px-4 py-3 serif text-center"
          style={{
            backgroundColor: bg,
            clipPath: "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%, 8% 50%)",
          }}
        >
          <p className={`italic ${titleClass}`} style={{ color: ink }}>{card.title}</p>
        </div>
      );
  }
}
