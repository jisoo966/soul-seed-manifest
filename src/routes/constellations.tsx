import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, X, Sparkles } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { DottedGlyph } from "@/components/DottedGlyph";

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

const seedManifestations: Manifestation[] = [];

// floating signs — unattached to any manifestation. drift in the upper sky.
type FloatingSign = Sign & { x: number; y: number; drift: number };
const seedFloatingSigns: FloatingSign[] = [];

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

  const [manifestations, setManifestations] = useState<Manifestation[]>(seedManifestations);
  const [floatingSigns] = useState<FloatingSign[]>(seedFloatingSigns);
  const [adding, setAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftHorizon, setDraftHorizon] = useState<Horizon>("thisSeason");

  const [phase, setPhase] = useState<"falling" | "landed" | "suggesting" | null>(
    search.landing === "1" ? "falling" : null
  );
  // manifested ritual phase
  const [ritual, setRitual] = useState<"descending" | "celebrating" | null>(null);
  const [manifestedIds, setManifestedIds] = useState<Set<string>>(new Set());

  // suggest first active manifestation (could be smarter)
  const suggested = manifestations[0];

  function addManifestation() {
    const t = draftTitle.trim();
    if (!t) return;
    const totalDays =
      draftHorizon === "thisMonth" ? 30 :
      draftHorizon === "thisSeason" ? 90 :
      draftHorizon === "thisYear" ? 220 : 0;
    const id = `m-${Date.now()}`;
    setManifestations((arr) => [
      ...arr,
      {
        id,
        title: t,
        horizon: draftHorizon,
        startedDaysAgo: 0,
        totalDays,
        x: 20 + Math.round(Math.random() * 60),
        signs: [],
      },
    ]);
    setDraftTitle("");
    setAdding(false);
  }

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
    if (attachToManifestation && suggested) setZoomed(suggested.id);
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
      <header className="pt-3 flex items-center justify-between">
        {zoomed ? (
          <button onClick={() => setZoomed(null)} className="p-1">
            <ArrowLeft className="h-5 w-5 text-ink" strokeWidth={1.4} />
          </button>
        ) : (
          <Link to="/" className="p-1"><ArrowLeft className="h-5 w-5 text-ink" strokeWidth={1.4} /></Link>
        )}
        <h1 className="text-[16px] serif text-ink">
          {active ? <em className="italic">your manifestation</em> : "Your sky"}
        </h1>
        <button onClick={() => setAdding(true)} className="p-1" aria-label="Add a wish">
          <Plus className="h-5 w-5 text-ink" strokeWidth={1.4} />
        </button>
      </header>

      <p className="small-caps text-center mt-3" style={{ color: "var(--color-burgundy)" }}>
        {active
          ? `${active.signs.length} signs · ${remainingLabel(active)}`
          : "near sky · this month  ·  far sky · someday"}
      </p>

      {!active && (
        <p className="mt-2 text-center serif italic text-[11px]" style={{ color: "oklch(0.85 0.05 85 / 0.75)" }}>
          your wishes become stars · tap one to see its signs
        </p>
      )}

      {/* the sky */}
      <div className="celestial dark relative mt-3 rounded-2xl aspect-[3/4] overflow-hidden border" style={{ borderColor: "var(--color-burgundy)", backgroundColor: "oklch(0.1 0 0)" }}>
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
                <DottedGlyph variant="star" size={10} />
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
                    color: isManifested ? "var(--color-paper)" : "var(--color-mustard)",
                    filter: isManifested
                      ? "drop-shadow(0 0 14px var(--color-paper)) drop-shadow(0 0 30px oklch(0.88 0.09 85 / 0.7))"
                      : `drop-shadow(0 0 ${8 * band.glow}px oklch(0.88 0.09 85 / ${0.5 + 0.3 * band.glow}))`,
                  }}
                >
                  <DottedGlyph
                    variant={isManifested ? "fleuron" : "star"}
                    size={band.size + (isManifested ? 6 : 2)}
                  />
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
        {phase === "falling" && suggested && (
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
            <DottedGlyph variant="star" size={22} />
          </span>
        )}
        {(phase === "landed" || phase === "suggesting") && suggested && (
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
            <DottedGlyph variant="star" size={22} />
          </span>
        )}

        {/* EMPTY STATE — no manifestations yet */}
        {!active && manifestations.length === 0 && floatingSigns.length === 0 && phase === null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center pointer-events-none">
            <span style={{ color: "oklch(0.88 0.09 85 / 0.8)" }}>
              <DottedGlyph variant="star" size={26} />
            </span>
            <p className="mt-4 serif italic text-[15px] leading-snug" style={{ color: "var(--color-paper)" }}>
              your sky is empty.
            </p>
            <p className="mt-2 serif text-[12px] leading-relaxed" style={{ color: "oklch(0.85 0.05 85 / 0.7)" }}>
              name a wish — it becomes a star.<br />
              over time, signs gather around it.
            </p>
            <button
              onClick={() => setAdding(true)}
              className="pointer-events-auto mt-5 px-4 py-2 rounded-full serif italic text-[12px] border"
              style={{
                color: "var(--color-paper)",
                borderColor: "oklch(0.88 0.09 85 / 0.5)",
                backgroundColor: "oklch(0.2 0.02 60 / 0.4)",
              }}
            >
              + name your first wish
            </button>
          </div>
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

      {/* zoomed manifestation — detailed timeline */}
      {active && (
        <div className="paper-card rounded-lg mt-3 px-4 py-3">
          <p className="serif italic text-[14px] text-ink leading-snug">{active.title}</p>
          <p className="small-caps mt-1 text-[10px]" style={{ color: "var(--color-burgundy)" }}>
            {HORIZONS[active.horizon].label}
          </p>

          {active.totalDays > 0 ? (
            <Timeline m={active} onOpen={(s) => setOpen(s)} />
          ) : (
            <p className="mt-3 text-[12px] serif italic text-sepia">no horizon · open to the universe</p>
          )}

          {!manifestedIds.has(active.id) && (
            <button
              onClick={() => setRitual("descending")}
              className="mt-4 w-full py-2.5 rounded-lg serif italic text-[13px]"
              style={{
                backgroundColor: "var(--color-paper)",
                color: "var(--color-burgundy)",
                border: "1px dashed var(--color-burgundy)",
              }}
            >
              <span className="inline-flex items-center gap-2"><DottedGlyph variant="fleuron" size={16} />Mark as manifested</span>
            </button>
          )}
        </div>
      )}

      {/* MANIFESTED RITUAL — descent + celebration */}
      {ritual === "descending" && active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "oklch(0.1 0.02 60 / 0.92)" }}>
          <span
            className="text-6xl"
            style={{
              color: "var(--color-paper)",
              textShadow: "0 0 40px var(--color-paper), 0 0 80px oklch(0.88 0.09 85 / 0.9)",
              animation: "descend 1.8s cubic-bezier(.4,.05,.2,1) forwards",
            }}
          >
            <DottedGlyph variant="star" size={80} />
          </span>
        </div>
      )}
      {ritual === "celebrating" && active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ backgroundColor: "oklch(0.1 0.02 60 / 0.95)", animation: "fade-in 0.5s ease-out" }}>
          {/* burst sparkles */}
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute text-xs pointer-events-none"
              style={{
                color: "var(--color-mustard)",
                top: "50%", left: "50%",
                animation: `burst 1.6s ease-out ${i * 0.05}s forwards`,
                ["--ang" as any]: `${i * 45}deg`,
              }}
            ><DottedGlyph variant="star" size={20} /></span>
          ))}
          <div className="max-w-[300px] text-center">
            <span className="text-5xl block mb-4" style={{ color: "var(--color-paper)", textShadow: "0 0 30px var(--color-paper)" }}><DottedGlyph variant="fleuron" size={22} /></span>
            <p className="small-caps mb-3" style={{ color: "var(--color-mustard)" }}>a message arrived</p>
            <p className="serif italic text-[20px] leading-snug" style={{ color: "var(--color-paper)" }}>
              &ldquo;It came.<br />Remember when you weren&apos;t sure?&rdquo;
            </p>
            <p className="mt-4 serif text-[13px]" style={{ color: "oklch(0.85 0.05 85 / 0.85)" }}>
              {active.title}
            </p>
            <button
              onClick={completeRitual}
              className="mt-6 px-5 py-2.5 rounded-full serif italic text-[13px]"
              style={{ backgroundColor: "var(--color-paper)", color: "var(--color-burgundy)" }}
            >
              Press it into the archive
            </button>
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

function Timeline({ m, onOpen }: { m: Manifestation; onOpen: (s: Sign) => void }) {
  const progress = Math.min(1, m.startedDaysAgo / m.totalDays);
  const dayOfSign = (i: number) =>
    m.signs.length > 0 ? Math.round(((i + 0.5) / m.signs.length) * m.startedDaysAgo) : 0;
  return (
    <div className="mt-3">
      <div className="relative h-9">
        <div className="absolute left-0 right-0 top-1/2 h-px" style={{ backgroundColor: "oklch(0.55 0.03 70 / 0.4)" }} />
        <div
          className="absolute left-0 top-1/2 h-px"
          style={{ width: `${progress * 100}%`, backgroundColor: "var(--color-burgundy)", transform: "translateY(-0.5px)" }}
        />
        <div
          className="absolute top-0 bottom-0 flex flex-col items-center"
          style={{ left: `${progress * 100}%`, transform: "translateX(-50%)" }}
        >
          <span className="w-0.5 h-full" style={{ backgroundColor: "var(--color-burgundy)" }} />
          <span className="absolute -bottom-4 text-[9px] serif italic" style={{ color: "var(--color-burgundy)" }}>today</span>
        </div>
        {m.signs.map((s, i) => {
          const left = (dayOfSign(i) / m.totalDays) * 100;
          return (
            <button
              key={s.id}
              onClick={() => onOpen(s)}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full hover:scale-150 transition"
              style={{ left: `${left}%`, width: 8, height: 8, backgroundColor: "var(--color-mustard)", boxShadow: "0 0 6px oklch(0.88 0.09 85 / 0.8)" }}
              aria-label={s.title}
            />
          );
        })}
      </div>
      <div className="mt-5 flex justify-between text-[10px] serif italic text-sepia">
        <span>started · {m.startedDaysAgo}d ago</span>
        <span>{m.totalDays - m.startedDaysAgo} days left · {m.signs.length} signs</span>
      </div>
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
    paper: "oklch(0.95 0.01 70)",
    moss: "oklch(0.86 0.05 145)",
    sky: "oklch(0.84 0.04 240)",
    mustard: "oklch(0.88 0.09 85)",
    burgundy: "oklch(0.78 0.08 25)",
  } as const)[t];
}

function Sticker({ sign, mini = false }: { sign: Sign; mini?: boolean }) {
  const bg = toneVar(sign.tone);
  const ink = "oklch(0.18 0 0)";
  const t = mini ? "text-[8px] leading-tight" : "text-[15px] leading-snug";
  const pad = mini ? "px-1.5 py-1.5" : "px-3 py-3";

  switch (sign.shape) {
    case "polaroid":
      return (
        <div className="paper-card rounded-sm p-1 pb-2" style={{ backgroundColor: bg }}>
          <div className="aspect-[5/4] rounded-sm flex items-center justify-center" style={{ backgroundColor: "oklch(0.88 0.03 70)" }}>
            <span className={mini ? "text-xs" : "text-2xl"} style={{ color: "var(--color-moss)" }}><DottedGlyph variant="fleuron" size={22} /></span>
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
