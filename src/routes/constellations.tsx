import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, X, Sparkles } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";

type Search = { landing?: "1"; title?: string; kind?: string };

export const Route = createFileRoute("/constellations")({
  head: () => ({
    meta: [
      { title: "Constellations — Sisi" },
      { name: "description", content: "Your inner sky. Zoom in to read the stars." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    landing: s.landing === "1" ? "1" : undefined,
    title: typeof s.title === "string" ? s.title : undefined,
    kind: typeof s.kind === "string" ? s.kind : undefined,
  }),
  component: Constellations,
});


// ---------- data ----------
type Shape = "polaroid" | "torn" | "cloud" | "ribbon" | "ticket" | "pennant";
type Tone = "paper" | "moss" | "sky" | "mustard" | "burgundy";

type Card = {
  id: string;
  kind: string;
  title: string;
  note: string;
  date: string;
  daysAgo: number; // for spiral order (0 = most recent → center)
  shape: Shape;
  tone: Tone;
};

type Cluster = {
  id: string;
  label: string;
  cx: number; // % on the sky
  cy: number;
  nebula: string; // oklch color
  glyph: string;
  cards: Card[];
};

const clusters: Cluster[] = [
  {
    id: "relationship",
    label: "relationship",
    cx: 32, cy: 30,
    nebula: "oklch(0.78 0.08 25 / 0.18)",
    glyph: "❦",
    cards: [
      { id: "r1", kind: "Wish", title: "to feel chosen", note: "You said you wanted to feel chosen. I want to remember this.", date: "Jun 02", daysAgo: 0, shape: "ribbon", tone: "burgundy" },
      { id: "r2", kind: "Memory", title: "morning light", note: "The cafe by the river. We sat without speaking for an hour.", date: "May 28", daysAgo: 1, shape: "polaroid", tone: "paper" },
      { id: "r3", kind: "Thought", title: "slow arrival", note: "Some things arrive slowly. That isn't the same as never.", date: "May 20", daysAgo: 2, shape: "torn", tone: "moss" },
      { id: "r4", kind: "Sign", title: "white feather", note: "Saw a white feather on my way to work.", date: "May 14", daysAgo: 3, shape: "pennant", tone: "mustard" },
    ],
  },
  {
    id: "work",
    label: "the work",
    cx: 72, cy: 48,
    nebula: "oklch(0.84 0.04 240 / 0.18)",
    glyph: "✦",
    cards: [
      { id: "w1", kind: "Manifestation", title: "the interview", note: "It went better than I expected. I almost felt held.", date: "Jun 01", daysAgo: 0, shape: "polaroid", tone: "paper" },
      { id: "w2", kind: "Dream", title: "open door", note: "I dreamt the door was already open. I just had to walk.", date: "May 25", daysAgo: 1, shape: "cloud", tone: "sky" },
      { id: "w3", kind: "Sync", title: "the song", note: "The song I'd been thinking of, on the radio. Twice.", date: "May 18", daysAgo: 2, shape: "ticket", tone: "paper" },
    ],
  },
  {
    id: "self",
    label: "becoming",
    cx: 38, cy: 74,
    nebula: "oklch(0.86 0.05 145 / 0.16)",
    glyph: "✿",
    cards: [
      { id: "s1", kind: "Thought", title: "softer mornings", note: "I'm beginning to like the mornings again.", date: "May 30", daysAgo: 0, shape: "torn", tone: "moss" },
      { id: "s2", kind: "Wish", title: "patience", note: "Less rushing. Less reaching. More noticing.", date: "May 22", daysAgo: 1, shape: "ribbon", tone: "burgundy" },
    ],
  },
];

// ---------- spiral layout helpers ----------
// most recent at center; older spirals outward
const GOLDEN_ANGLE = 137.5;
function spiralPos(i: number, total: number) {
  const angle = (i * GOLDEN_ANGLE) * (Math.PI / 180);
  // tighter spiral; radius in % of cluster viewport (we render in a 200x200 box)
  const radius = 8 + i * 16;
  const x = 50 + Math.cos(angle) * radius;
  const y = 50 + Math.sin(angle) * radius;
  const rot = (i % 2 === 0 ? -1 : 1) * (3 + i * 1.5);
  const scale = 1 - i * 0.06;
  return { x, y, rot, scale };
}

// ---------- component ----------
function kindToCluster(kind?: string) {
  if (!kind) return "relationship";
  if (["Wish", "Memory"].includes(kind)) return "relationship";
  if (["Sign", "Sync", "Dream", "Manifestation"].includes(kind)) return "work";
  return "self";
}

function Constellations() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [zoomed, setZoomed] = useState<string | null>(null);
  const [open, setOpen] = useState<Card | null>(null);

  // landing animation: 'falling' → 'landed' → 'suggesting' → null
  const [phase, setPhase] = useState<"falling" | "landed" | "suggesting" | null>(
    search.landing === "1" ? "falling" : null
  );
  const suggestedId = kindToCluster(search.kind);
  const suggested = clusters.find((c) => c.id === suggestedId)!;

  useEffect(() => {
    if (phase !== "falling") return;
    const t1 = setTimeout(() => setPhase("landed"), 1400);
    const t2 = setTimeout(() => setPhase("suggesting"), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

  function dismissLanding(zoomInto: boolean) {
    setPhase(null);
    navigate({ to: "/constellations", search: {}, replace: true });
    if (zoomInto) setZoomed(suggestedId);
  }

  const active = clusters.find((c) => c.id === zoomed);
  // camera transform: when zoomed, scale 2.4 around cluster center
  const scale = active ? 2.4 : 1;
  const tx = active ? 50 - active.cx : 0;
  const ty = active ? 50 - active.cy : 0;


  return (
    <PhoneFrame>
      <header className="pt-4 flex items-center justify-between">
        {zoomed ? (
          <button onClick={() => setZoomed(null)} className="p-1">
            <ArrowLeft className="h-5 w-5 text-ink" strokeWidth={1.4} />
          </button>
        ) : (
          <Link to="/" className="p-1"><ArrowLeft className="h-5 w-5 text-ink" strokeWidth={1.4} /></Link>
        )}
        <h1 className="text-lg serif text-ink">
          {active ? <em className="italic">{active.label}</em> : "Your sky"}
        </h1>
        <button className="p-1"><Plus className="h-5 w-5 text-ink" strokeWidth={1.4} /></button>
      </header>

      <p className="small-caps text-center mt-4" style={{ color: "var(--color-burgundy)" }}>
        {active ? `${active.cards.length} entries · most recent at center` : "tap a constellation to enter it"}
      </p>

      {/* the sky */}
      <div
        className="celestial relative mt-4 rounded-2xl aspect-[3/4] overflow-hidden border"
        style={{ borderColor: "var(--color-burgundy)" }}
      >
        {/* camera */}
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
            transformOrigin: "50% 50%",
            transition: "transform 700ms cubic-bezier(.6,.05,.2,1)",
          }}
        >
          {/* nebulas */}
          {clusters.map((c) => (
            <div
              key={c.id + "neb"}
              className="absolute rounded-full"
              style={{
                left: `${c.cx}%`, top: `${c.cy}%`,
                width: "44%", height: "44%",
                transform: "translate(-50%,-50%)",
                background: `radial-gradient(circle, ${c.nebula} 0%, transparent 70%)`,
                filter: zoomed && zoomed !== c.id ? "blur(2px)" : "none",
                opacity: zoomed && zoomed !== c.id ? 0.35 : 1,
                transition: "opacity 500ms, filter 500ms",
              }}
            />
          ))}

          {/* constellation lines (sky view) */}
          {!active && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {clusters.flatMap((c) =>
                c.cards.slice(0, -1).map((_, i) => {
                  const p1 = starPos(c, i, c.cards.length);
                  const p2 = starPos(c, i + 1, c.cards.length);
                  return (
                    <line
                      key={`${c.id}-l-${i}`}
                      x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                      stroke="oklch(0.88 0.09 85)"
                      strokeOpacity={0.35}
                      strokeWidth={0.25}
                      strokeDasharray="0.6 0.8"
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })
              )}
            </svg>
          )}

          {/* sky view: clusters as breathing stars */}
          {!active && clusters.map((c) => (
            <button
              key={c.id}
              onClick={() => setZoomed(c.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
              style={{ left: `${c.cx}%`, top: `${c.cy}%` }}
            >
              {c.cards.map((_, i) => {
                const p = starPos(c, i, c.cards.length);
                const dx = p.x - c.cx;
                const dy = p.y - c.cy;
                return (
                  <span
                    key={i}
                    className="absolute text-[10px] breathe"
                    style={{
                      left: `${dx * 4}px`,
                      top: `${dy * 4}px`,
                      color: "var(--color-mustard)",
                      animationDelay: `${i * 0.4}s`,
                      textShadow: "0 0 6px oklch(0.88 0.09 85 / 0.6)",
                    }}
                  >
                    ✦
                  </span>
                );
              })}
              <span
                className="serif italic text-[11px] mt-10 px-2 py-0.5 rounded-full"
                style={{
                  color: "var(--color-paper)",
                  backgroundColor: "oklch(0.2 0.02 60 / 0.5)",
                }}
              >
                {c.label} · {c.cards.length}
              </span>
            </button>
          ))}

          {/* cluster view: spiral of cards */}
          {active && (
            <div
              className="absolute"
              style={{
                left: `${active.cx}%`, top: `${active.cy}%`,
                width: "200px", height: "200px",
                transform: "translate(-50%,-50%)",
              }}
            >
              {active.cards.map((card, i) => {
                const p = spiralPos(i, active.cards.length);
                return (
                  <button
                    key={card.id}
                    onClick={() => setOpen(card)}
                    className="absolute"
                    style={{
                      left: `${p.x}%`, top: `${p.y}%`,
                      width: "70px",
                      transform: `translate(-50%,-50%) rotate(${p.rot}deg) scale(${p.scale})`,
                      filter: "drop-shadow(0 4px 8px oklch(0 0 0 / 0.45))",
                      animation: `bloom 500ms cubic-bezier(.2,.9,.3,1.2) ${i * 80}ms both`,
                    }}
                  >
                    <Sticker card={card} mini />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* falling new star — sits above the camera so it lands in board coords */}
        {phase === "falling" && (
          <span
            className="absolute text-2xl pointer-events-none z-30"
            style={{
              left: "50%", top: "-8%",
              color: "var(--color-mustard)",
              textShadow: "0 0 14px oklch(0.88 0.09 85 / 0.9)",
              animation: "starFall 1.4s cubic-bezier(.55,.05,.3,1) forwards",
              ["--tx" as any]: `${suggested.cx - 50}%`,
              ["--ty" as any]: `${suggested.cy + 8}%`,
            }}
          >
            ✦
          </span>
        )}
        {(phase === "landed" || phase === "suggesting") && (
          <span
            className="absolute text-xl pointer-events-none z-30"
            style={{
              left: `${suggested.cx}%`, top: `${suggested.cy}%`,
              transform: "translate(-50%,-50%)",
              color: "var(--color-mustard)",
              textShadow: "0 0 18px oklch(0.88 0.09 85 / 0.9)",
              animation: "starTwinkle 1.6s ease-out 2",
            }}
          >
            ✦
          </span>
        )}

        {/* dim overlay click-out for cluster mode */}
        {active && (
          <button
            onClick={() => setZoomed(null)}
            className="absolute inset-0"
            aria-label="zoom out"
            style={{ background: "transparent" }}
          />
        )}
      </div>

      {/* sisi suggestion after landing */}
      {phase === "suggesting" && (
        <div
          className="paper-card rounded-xl mt-4 px-4 py-3"
          style={{ animation: "fade-in 0.4s ease-out", borderColor: "var(--color-burgundy)" }}
        >
          <p className="small-caps mb-1 flex items-center gap-1.5" style={{ color: "var(--color-burgundy)" }}>
            <Sparkles className="h-3 w-3" strokeWidth={1.5} /> sisi noticed
          </p>
          {search.title && (
            <p className="serif italic text-[14px] text-ink leading-snug">
              &ldquo;{search.title}&rdquo;
            </p>
          )}
          <p className="mt-2 serif text-[13px] text-ink/85">
            This feels like it belongs with <em className="italic" style={{ color: "var(--color-burgundy)" }}>{suggested.label}</em>.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => dismissLanding(true)}
              className="flex-1 py-2 rounded-lg serif italic text-[13px]"
              style={{ backgroundColor: "var(--color-burgundy)", color: "var(--color-paper)" }}
            >
              Add to {suggested.label}
            </button>
            <button
              onClick={() => dismissLanding(false)}
              className="px-3 py-2 rounded-lg serif italic text-[13px] text-ink border"
              style={{ borderColor: "var(--color-burgundy)" }}
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {!phase && (
        <p className="mt-3 text-center text-[11px] serif italic text-sepia">
          {active ? "tap a card · tap empty space to pull back" : "your sky is still forming · little by little"}
        </p>
      )}


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
            className="w-full max-w-[300px]"
            style={{ animation: "stickerIn 380ms cubic-bezier(.2,.9,.3,1.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Sticker card={open} />
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

// for sky-view constellation lines: same spiral, projected to global %
function starPos(c: Cluster, i: number, _total: number) {
  const p = spiralPos(i, _total);
  // cluster local 0-100 → global %, scaling by ~12% of board width
  return {
    x: c.cx + (p.x - 50) * 0.12,
    y: c.cy + (p.y - 50) * 0.12,
  };
}

// ---------- sticker shapes (compact) ----------
function toneVar(t: Tone) {
  return {
    paper: "var(--color-paper)",
    moss: "oklch(0.86 0.05 145)",
    sky: "oklch(0.84 0.04 240)",
    mustard: "oklch(0.88 0.09 85)",
    burgundy: "oklch(0.78 0.08 25)",
  }[t];
}

function Sticker({ card, mini = false }: { card: Card; mini?: boolean }) {
  const bg = toneVar(card.tone);
  const ink = "var(--color-ink)";
  const t = mini ? "text-[8px] leading-tight" : "text-[15px] leading-snug";
  const pad = mini ? "px-1.5 py-1.5" : "px-3 py-3";

  switch (card.shape) {
    case "polaroid":
      return (
        <div className="paper-card rounded-sm p-1 pb-2" style={{ backgroundColor: bg }}>
          <div className="aspect-[5/4] rounded-sm flex items-center justify-center" style={{ backgroundColor: "oklch(0.88 0.03 70)" }}>
            <span className={mini ? "text-xs" : "text-2xl"} style={{ color: "var(--color-moss)" }}>❦</span>
          </div>
          <p className={`mt-0.5 italic serif text-center ${t}`} style={{ color: ink }}>{card.title}</p>
        </div>
      );
    case "torn":
      return (
        <div className={`torn-note serif text-center ${pad}`} style={{ backgroundColor: bg }}>
          <p className={`italic ${t}`} style={{ color: ink }}>{card.title}</p>
        </div>
      );
    case "cloud":
      return (
        <div
          className={`serif text-center ${pad}`}
          style={{
            backgroundColor: bg,
            borderRadius: "50% 45% 55% 50% / 60% 55% 50% 50%",
            border: "1px solid oklch(0.55 0.03 70 / 0.4)",
          }}
        >
          <p className={`italic ${t}`} style={{ color: ink }}>{card.title}</p>
        </div>
      );
    case "ribbon":
      return (
        <div className={`relative serif ${pad}`} style={{ backgroundColor: bg }}>
          <span className="absolute left-0 top-0 h-full" style={{ width: mini ? "3px" : "8px", backgroundColor: "var(--color-burgundy)" }} />
          <p className={`italic ${t} pl-1`} style={{ color: ink }}>{card.title}</p>
        </div>
      );
    case "ticket":
      return (
        <div
          className={`serif text-center ${pad}`}
          style={{
            backgroundColor: bg,
            borderTop: "1px dashed var(--color-burgundy)",
            borderBottom: "1px dashed var(--color-burgundy)",
          }}
        >
          <p className={`italic ${t}`} style={{ color: ink }}>{card.title}</p>
        </div>
      );
    case "pennant":
      return (
        <div
          className={`serif text-center ${pad}`}
          style={{
            backgroundColor: bg,
            clipPath: "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%, 8% 50%)",
          }}
        >
          <p className={`italic ${t}`} style={{ color: ink }}>{card.title}</p>
        </div>
      );
  }
}
