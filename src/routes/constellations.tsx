import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, X, Sparkles } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";

type Search = { landing?: "1"; title?: string; kind?: string };

export const Route = createFileRoute("/constellations")({
  head: () => ({
    meta: [
      { title: "Sky — Sisi" },
      { name: "description", content: "Your manifestations in motion." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    landing: s.landing === "1" ? "1" : undefined,
    title: typeof s.title === "string" ? s.title : undefined,
    kind: typeof s.kind === "string" ? s.kind : undefined,
  }),
  component: Sky,
});

// ---------- data ----------
type Horizon = "thisMonth" | "thisSeason" | "thisYear" | "someday";
type Shape = "polaroid" | "torn" | "cloud" | "ribbon" | "ticket" | "pennant";
type Tone = "paper" | "moss" | "sky" | "mustard" | "burgundy";

type Sign = {
  id: string; kind: string; title: string; note: string; date: string;
  shape: Shape; tone: Tone;
};

type Manifestation = {
  id: string;
  title: string;
  horizon: Horizon;
  startedDaysAgo: number;
  totalDays: number;       // window length
  x: number;               // % within sky band
  signs: Sign[];
};

const HORIZONS: Record<Horizon, { label: string; y: number; size: number; glow: number }> = {
  someday:    { label: "someday",      y: 14, size: 9,  glow: 0.4 },
  thisYear:   { label: "this year",    y: 36, size: 12, glow: 0.6 },
  thisSeason: { label: "this season",  y: 60, size: 15, glow: 0.8 },
  thisMonth:  { label: "this month",   y: 84, size: 19, glow: 1.0 },
};

const manifestations: Manifestation[] = [
  {
    id: "studio",
    title: "Land the role at the studio I've been watching",
    horizon: "thisYear", startedDaysAgo: 38, totalDays: 220, x: 30,
    signs: [
      { id: "s1", kind: "Sync", title: "the senior reached out", note: "She replied to my email — within an hour.", date: "May 28", shape: "ticket", tone: "paper" },
      { id: "s2", kind: "Sign", title: "their job page changed", note: "A new opening appeared, almost written for me.", date: "May 20", shape: "pennant", tone: "mustard" },
      { id: "s3", kind: "Thought", title: "I belong in that room", note: "I felt it for a second, and I want to feel it again.", date: "May 12", shape: "torn", tone: "moss" },
    ],
  },
  {
    id: "body",
    title: "Reach 65kg with strength, not punishment",
    horizon: "thisMonth", startedDaysAgo: 18, totalDays: 30, x: 70,
    signs: [
      { id: "b1", kind: "Manifestation", title: "first 5km without stopping", note: "I didn't even mean to. The body just kept going.", date: "Jun 03", shape: "polaroid", tone: "paper" },
      { id: "b2", kind: "Sign", title: "the mirror moment", note: "The shirt sat differently. Quietly different.", date: "May 30", shape: "ribbon", tone: "burgundy" },
    ],
  },
  {
    id: "draft",
    title: "Finish the first draft",
    horizon: "thisSeason", startedDaysAgo: 22, totalDays: 90, x: 32,
    signs: [
      { id: "d1", kind: "Dream", title: "the open door", note: "I dreamt the door was already open. I just had to walk.", date: "May 25", shape: "cloud", tone: "sky" },
    ],
  },
  {
    id: "home",
    title: "Find a home that feels like mine",
    horizon: "someday", startedDaysAgo: 0, totalDays: 0, x: 65,
    signs: [],
  },
];

// floating signs — unattached to any manifestation. drift in the upper sky.
type FloatingSign = Sign & { x: number; y: number; drift: number };
const floatingSigns: FloatingSign[] = [
  { id: "f1", kind: "Sync", title: "the song on the radio", note: "The song I'd been thinking of. Twice in one day.", date: "Jun 04", shape: "ticket", tone: "paper", x: 18, y: 6, drift: 0 },
  { id: "f2", kind: "Sign", title: "white feather", note: "Saw a white feather on my way to work.", date: "Jun 02", shape: "pennant", tone: "mustard", x: 52, y: 4, drift: 1.2 },
  { id: "f3", kind: "Thought", title: "less rushing", note: "Less rushing. More noticing.", date: "May 30", shape: "torn", tone: "moss", x: 82, y: 8, drift: 2.4 },
  { id: "f4", kind: "Sync", title: "11:11 again", note: "Looked up at 11:11. Smiled.", date: "May 27", shape: "ticket", tone: "paper", x: 90, y: 24, drift: 0.6 },
];

// ---------- spiral for zoomed signs ----------
const GOLDEN_ANGLE = 137.5;
function spiralPos(i: number) {
  const angle = (i * GOLDEN_ANGLE) * (Math.PI / 180);
  const radius = 8 + i * 16;
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius,
    rot: (i % 2 === 0 ? -1 : 1) * (3 + i * 1.5),
    scale: 1 - i * 0.06,
  };
}


// ---------- component ----------
function Sky() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [zoomed, setZoomed] = useState<string | null>(null);
  const [open, setOpen] = useState<Sign | null>(null);

  const [phase, setPhase] = useState<"falling" | "landed" | "suggesting" | null>(
    search.landing === "1" ? "falling" : null
  );
  // manifested ritual phase
  const [ritual, setRitual] = useState<"descending" | "celebrating" | null>(null);
  const [manifestedIds, setManifestedIds] = useState<Set<string>>(new Set());

  // suggest first active manifestation (could be smarter)
  const suggested = manifestations[0];

  useEffect(() => {
    if (phase !== "falling") return;
    const t1 = setTimeout(() => setPhase("landed"), 1400);
    const t2 = setTimeout(() => setPhase("suggesting"), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

  useEffect(() => {
    if (ritual !== "descending") return;
    const t = setTimeout(() => setRitual("celebrating"), 1800);
    return () => clearTimeout(t);
  }, [ritual]);

  function dismissLanding(addAsFloating: boolean, attachToManifestation: boolean) {
    setPhase(null);
    navigate({ to: "/constellations", search: {}, replace: true });
    if (attachToManifestation) setZoomed(suggested.id);
    // (addAsFloating is the default behavior — sign stays in sky)
    void addAsFloating;
  }

  function completeRitual() {
    if (active) {
      setManifestedIds((s) => new Set(s).add(active.id));
    }
    setRitual(null);
    setZoomed(null);
  }

  const active = manifestations.find((m) => m.id === zoomed);
  const scale = active ? 2.4 : 1;
  const tx = active ? 50 - active.x : 0;
  const ty = active ? 50 - HORIZONS[active.horizon].y : 0;


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
          {active ? <em className="italic">your manifestation</em> : "Your sky"}
        </h1>
        <button className="p-1"><Plus className="h-5 w-5 text-ink" strokeWidth={1.4} /></button>
      </header>

      <p className="small-caps text-center mt-4" style={{ color: "var(--color-burgundy)" }}>
        {active
          ? `${active.signs.length} signs · ${remainingLabel(active)}`
          : "near sky · this month  ·  far sky · someday"}
      </p>

      {/* the sky */}
      <div className="celestial relative mt-4 rounded-2xl aspect-[3/4] overflow-hidden border" style={{ borderColor: "var(--color-burgundy)" }}>
        {/* horizon bands — only on sky view */}
        {!active && (
          <>
            {(Object.keys(HORIZONS) as Horizon[]).map((h) => {
              const band = HORIZONS[h];
              return (
                <div key={h} className="absolute left-0 right-0 pointer-events-none" style={{ top: `${band.y}%` }}>
                  <div className="border-t border-dashed" style={{ borderColor: "oklch(0.88 0.09 85 / 0.18)" }} />
                  <span className="absolute left-3 -top-2 small-caps text-[9px]" style={{ color: "oklch(0.85 0.06 85 / 0.6)" }}>
                    {band.label}
                  </span>
                </div>
              );
            })}
          </>
        )}

        {/* camera */}
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
            transformOrigin: "50% 50%",
            transition: "transform 700ms cubic-bezier(.6,.05,.2,1)",
          }}
        >
          {/* floating signs — unattached, drift in upper sky */}
          {!active && floatingSigns.map((f) => (
            <button
              key={f.id}
              onClick={() => setOpen(f)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${f.x}%`, top: `${f.y}%`,
                animation: `drift 6s ease-in-out ${f.drift}s infinite`,
              }}
              aria-label={f.title}
            >
              <span
                className="text-[7px]"
                style={{
                  color: "oklch(0.92 0.02 85 / 0.85)",
                  textShadow: "0 0 5px oklch(0.92 0.04 85 / 0.7)",
                }}
              >
                ✦
              </span>
            </button>
          ))}

          {/* sky view: manifestations as stars in their bands */}
          {!active && manifestations.map((m) => {
            const band = HORIZONS[m.horizon];
            const progress = m.totalDays > 0 ? Math.min(1, m.startedDaysAgo / m.totalDays) : 0;
            const isManifested = manifestedIds.has(m.id);
            return (
              <button
                key={m.id}
                onClick={() => setZoomed(m.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${m.x}%`, top: `${band.y}%`, width: "44%" }}
              >
                <span
                  className={isManifested ? "" : "breathe"}
                  style={{
                    fontSize: `${band.size + (isManifested ? 4 : 0)}px`,
                    color: isManifested ? "var(--color-paper)" : "var(--color-mustard)",
                    textShadow: isManifested
                      ? "0 0 20px var(--color-paper), 0 0 40px oklch(0.88 0.09 85 / 0.7)"
                      : `0 0 ${10 * band.glow}px oklch(0.88 0.09 85 / ${0.5 + 0.3 * band.glow})`,
                  }}
                >
                  {isManifested ? "❦" : "✦"}
                </span>
                <span
                  className="serif italic text-[10px] mt-1.5 px-2 py-0.5 rounded-full text-center leading-tight"
                  style={{
                    color: "var(--color-paper)",
                    backgroundColor: "oklch(0.2 0.02 60 / 0.55)",
                    maxWidth: "100%",
                  }}
                >
                  {isManifested ? "manifested · " : ""}{short(m.title)}
                </span>
                {m.totalDays > 0 && !isManifested && (
                  <ProgressArc progress={progress} signs={m.signs.length} />
                )}
              </button>
            );
          })}


          {/* cluster view: spiral of signs for this manifestation */}
          {active && (
            <div
              className="absolute"
              style={{
                left: `${active.x}%`, top: `${HORIZONS[active.horizon].y}%`,
                width: "180px", height: "180px",
                transform: "translate(-50%,-50%)",
              }}
            >
              {active.signs.map((sign, i) => {
                const p = spiralPos(i);
                return (
                  <button
                    key={sign.id}
                    onClick={() => setOpen(sign)}
                    className="absolute"
                    style={{
                      left: `${p.x}%`, top: `${p.y}%`,
                      width: "70px",
                      transform: `translate(-50%,-50%) rotate(${p.rot}deg) scale(${p.scale})`,
                      filter: "drop-shadow(0 4px 8px oklch(0 0 0 / 0.45))",
                      animation: `bloom 500ms cubic-bezier(.2,.9,.3,1.2) ${i * 80}ms both`,
                    }}
                  >
                    <Sticker sign={sign} mini />
                  </button>
                );
              })}
              {active.signs.length === 0 && (
                <p className="absolute inset-0 flex items-center justify-center text-center serif italic text-[11px] px-6" style={{ color: "var(--color-paper)" }}>
                  no signs yet · the sky is still listening
                </p>
              )}
            </div>
          )}
        </div>

        {/* falling new star */}
        {phase === "falling" && (
          <span
            className="absolute text-2xl pointer-events-none z-30"
            style={{
              left: "50%", top: "-8%",
              color: "var(--color-mustard)",
              textShadow: "0 0 14px oklch(0.88 0.09 85 / 0.9)",
              animation: "starFall 1.4s cubic-bezier(.55,.05,.3,1) forwards",
              ["--tx" as any]: `${suggested.x - 50}%`,
              ["--ty" as any]: `${HORIZONS[suggested.horizon].y + 8}%`,
            }}
          >
            ✦
          </span>
        )}
        {(phase === "landed" || phase === "suggesting") && (
          <span
            className="absolute text-xl pointer-events-none z-30"
            style={{
              left: `${suggested.x}%`, top: `${HORIZONS[suggested.horizon].y}%`,
              transform: "translate(-50%,-50%)",
              color: "var(--color-mustard)",
              textShadow: "0 0 18px oklch(0.88 0.09 85 / 0.9)",
              animation: "starTwinkle 1.6s ease-out 2",
            }}
          >
            ✦
          </span>
        )}

        {active && (
          <button
            onClick={() => setZoomed(null)}
            className="absolute inset-0"
            aria-label="zoom out"
            style={{ background: "transparent" }}
          />
        )}
      </div>

      {/* zoomed manifestation header (below board) */}
      {active && (
        <div className="paper-card rounded-lg mt-3 px-4 py-3">
          <p className="serif italic text-[14px] text-ink leading-snug">{active.title}</p>
          <div className="mt-2">
            <ProgressBar
              progress={active.totalDays > 0 ? Math.min(1, active.startedDaysAgo / active.totalDays) : 0}
              label={remainingLabel(active)}
            />
          </div>
        </div>
      )}

      {/* sisi suggestion */}
      {phase === "suggesting" && (
        <div className="paper-card rounded-xl mt-4 px-4 py-3" style={{ animation: "fade-in 0.4s ease-out", borderColor: "var(--color-burgundy)" }}>
          <p className="small-caps mb-1 flex items-center gap-1.5" style={{ color: "var(--color-burgundy)" }}>
            <Sparkles className="h-3 w-3" strokeWidth={1.5} /> sisi noticed
          </p>
          {search.title && <p className="serif italic text-[14px] text-ink leading-snug">&ldquo;{search.title}&rdquo;</p>}
          <p className="mt-2 serif text-[13px] text-ink/85">
            This sign is now floating in your sky. It might belong with <em className="italic" style={{ color: "var(--color-burgundy)" }}>{short(suggested.title)}</em>.
          </p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => dismissLanding(false, true)} className="flex-1 py-2 rounded-lg serif italic text-[13px]" style={{ backgroundColor: "var(--color-burgundy)", color: "var(--color-paper)" }}>
              Attach to it
            </button>
            <button onClick={() => dismissLanding(true, false)} className="px-3 py-2 rounded-lg serif italic text-[13px] text-ink border" style={{ borderColor: "var(--color-burgundy)" }}>
              Leave floating
            </button>
          </div>

        </div>
      )}

      {!phase && !active && (
        <p className="mt-3 text-center text-[11px] serif italic text-sepia">
          tap a star to enter its story
        </p>
      )}

      {/* sign modal */}
      {open && (
        <div onClick={() => setOpen(null)} className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ backgroundColor: "oklch(0.15 0.02 60 / 0.85)", backdropFilter: "blur(4px)" }}>
          <button onClick={() => setOpen(null)} className="absolute top-6 right-6 p-2 rounded-full" style={{ backgroundColor: "var(--color-paper)", color: "var(--color-ink)" }}>
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <div className="w-full max-w-[300px]" style={{ animation: "stickerIn 380ms cubic-bezier(.2,.9,.3,1.2)" }} onClick={(e) => e.stopPropagation()}>
            <Sticker sign={open} />
            <div className="mt-4 text-center">
              <p className="small-caps" style={{ color: "var(--color-mustard)" }}>{open.kind} · {open.date}</p>
              <p className="mt-2 serif italic text-[15px]" style={{ color: "var(--color-paper)" }}>&ldquo;{open.note}&rdquo;</p>
            </div>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}

// ---------- subcomponents ----------
function ProgressArc({ progress, signs }: { progress: number; signs: number }) {
  // small horizon arc beneath the star
  const r = 24;
  const start = Math.PI; // left
  const end = 0;         // right (top semicircle)
  const angle = start + (end - start) * progress;
  const px = 30 + r * Math.cos(angle);
  const py = 28 - r * Math.sin(angle);
  return (
    <div className="mt-1 flex items-center gap-1.5">
      <svg width="60" height="18" viewBox="0 0 60 30">
        <path d="M 6 28 A 24 24 0 0 1 54 28" fill="none" stroke="oklch(0.88 0.09 85 / 0.25)" strokeWidth="1.2" strokeDasharray="2 2" />
        <path d={`M 6 28 A 24 24 0 0 1 ${px} ${py}`} fill="none" stroke="oklch(0.88 0.09 85 / 0.9)" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx={px} cy={py} r="2" fill="oklch(0.88 0.09 85)" />
      </svg>
      <span className="text-[9px] serif italic" style={{ color: "oklch(0.85 0.05 85 / 0.8)" }}>{signs}</span>
    </div>
  );
}

function ProgressBar({ progress, label }: { progress: number; label: string }) {
  return (
    <div>
      <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "oklch(0.78 0.08 25 / 0.2)" }}>
        <div className="h-full" style={{ width: `${progress * 100}%`, backgroundColor: "var(--color-burgundy)" }} />
      </div>
      <p className="mt-1.5 text-[11px] serif italic text-sepia">{label}</p>
    </div>
  );
}

function remainingLabel(m: Manifestation) {
  if (m.horizon === "someday") return "no horizon · open to the universe";
  const left = m.totalDays - m.startedDaysAgo;
  if (m.horizon === "thisMonth") return `${left} days left · ${m.signs.length} signs`;
  if (m.horizon === "thisSeason") {
    const weeks = Math.round(left / 7);
    return `${weeks} weeks left · ${m.signs.length} signs`;
  }
  const moons = Math.round(left / 30);
  return `${moons} more moons · ${m.signs.length} signs`;
}

function short(t: string) {
  return t.length > 28 ? t.slice(0, 28) + "…" : t;
}

// ---------- sticker shapes ----------
function toneVar(t: Tone) {
  return ({
    paper: "var(--color-paper)",
    moss: "oklch(0.86 0.05 145)",
    sky: "oklch(0.84 0.04 240)",
    mustard: "oklch(0.88 0.09 85)",
    burgundy: "oklch(0.78 0.08 25)",
  } as const)[t];
}

function Sticker({ sign, mini = false }: { sign: Sign; mini?: boolean }) {
  const bg = toneVar(sign.tone);
  const ink = "var(--color-ink)";
  const t = mini ? "text-[8px] leading-tight" : "text-[15px] leading-snug";
  const pad = mini ? "px-1.5 py-1.5" : "px-3 py-3";

  switch (sign.shape) {
    case "polaroid":
      return (
        <div className="paper-card rounded-sm p-1 pb-2" style={{ backgroundColor: bg }}>
          <div className="aspect-[5/4] rounded-sm flex items-center justify-center" style={{ backgroundColor: "oklch(0.88 0.03 70)" }}>
            <span className={mini ? "text-xs" : "text-2xl"} style={{ color: "var(--color-moss)" }}>❦</span>
          </div>
          <p className={`mt-0.5 italic serif text-center ${t}`} style={{ color: ink }}>{sign.title}</p>
        </div>
      );
    case "torn":
      return <div className={`torn-note serif text-center ${pad}`} style={{ backgroundColor: bg }}><p className={`italic ${t}`} style={{ color: ink }}>{sign.title}</p></div>;
    case "cloud":
      return <div className={`serif text-center ${pad}`} style={{ backgroundColor: bg, borderRadius: "50% 45% 55% 50% / 60% 55% 50% 50%", border: "1px solid oklch(0.55 0.03 70 / 0.4)" }}><p className={`italic ${t}`} style={{ color: ink }}>{sign.title}</p></div>;
    case "ribbon":
      return <div className={`relative serif ${pad}`} style={{ backgroundColor: bg }}><span className="absolute left-0 top-0 h-full" style={{ width: mini ? "3px" : "8px", backgroundColor: "var(--color-burgundy)" }} /><p className={`italic ${t} pl-1`} style={{ color: ink }}>{sign.title}</p></div>;
    case "ticket":
      return <div className={`serif text-center ${pad}`} style={{ backgroundColor: bg, borderTop: "1px dashed var(--color-burgundy)", borderBottom: "1px dashed var(--color-burgundy)" }}><p className={`italic ${t}`} style={{ color: ink }}>{sign.title}</p></div>;
    case "pennant":
      return <div className={`serif text-center ${pad}`} style={{ backgroundColor: bg, clipPath: "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%, 8% 50%)" }}><p className={`italic ${t}`} style={{ color: ink }}>{sign.title}</p></div>;
  }
}
