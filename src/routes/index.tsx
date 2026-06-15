import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

type Period = "week" | "month" | "year";
type Wish = { id: string; title: string; period: Period };


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sisi — a museum of everything you've ever loved" },
      { name: "description", content: "Sisi is a quiet companion that helps you manifest your wish — soft reminders, pressed moments, and the constellations of your inner world." },
      { property: "og:title", content: "Sisi — a museum of everything you've ever loved" },
      { property: "og:description", content: "A friend, checking in. Capture meaningful moments and watch your inner world take shape." },
    ],
  }),
  component: Home,
});

function Home() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [quick, setQuick] = useState("");
  const [quickPeriod, setQuickPeriod] = useState<Period>("year");
  const [ritualOpen, setRitualOpen] = useState(false);
  const [ritualTitle, setRitualTitle] = useState("");
  const [ritualPeriod, setRitualPeriod] = useState<Period>("year");
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const addWish = (title: string, period: Period) => {
    const t = title.trim();
    if (!t) return;
    const id = String(Date.now());
    setWishes((w) => [{ id, title: t, period }, ...w]);
    setJustAdded(id);
    setTimeout(() => setJustAdded((cur) => (cur === id ? null : cur)), 1600);
  };

  return (

    <PhoneFrame>
      <header className="pt-6">
        <div className="flex items-start justify-between">
          <p className="small-caps mb-2" style={{ color: "var(--color-burgundy)" }}>No. 47 · June</p>
          <Link
            to="/profile"
            aria-label="Your profile"
            className="h-9 w-9 rounded-full flex items-center justify-center serif text-sm transition hover:opacity-90"
            style={{
              backgroundColor: "var(--color-burgundy)",
              color: "var(--color-paper)",
              boxShadow: "0 4px 12px -6px var(--color-burgundy)",
            }}
          >
            J
          </Link>
        </div>
        <h1 className="text-[2rem] leading-tight text-ink serif">
          Good morning, <em className="font-light">Jisoo</em>.
        </h1>
        <p className="mt-2 text-sm text-sepia serif italic">
          Something from yesterday stayed with me.
          <span className="float-right text-lg not-italic" style={{ color: "var(--color-mustard)" }}>✦</span>
        </p>
      </header>

      {/* (A) one-line wish — quick send to the universe */}
      <section className="mt-6">
        <label className="small-caps block mb-2" style={{ color: "var(--color-burgundy)" }}>
          send a wish to the universe
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addWish(quick, quickPeriod);
            setQuick("");
          }}
          className="paper-card rounded-xl px-3 py-2 flex items-center gap-2"
        >
          <span className="text-lg shrink-0" style={{ color: "var(--color-mustard)" }}>✦</span>
          <input
            value={quick}
            onChange={(e) => setQuick(e.target.value)}
            placeholder="i will…"
            className="flex-1 bg-transparent outline-none serif italic text-[15px] text-ink placeholder:text-sepia/60 py-1"
          />
          <PeriodChip value={quickPeriod} onChange={setQuickPeriod} compact />
          <button
            type="submit"
            aria-label="send"
            disabled={!quick.trim()}
            className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center serif transition disabled:opacity-40"
            style={{ backgroundColor: "var(--color-burgundy)", color: "var(--color-paper)" }}
          >
            →
          </button>
        </form>

        {wishes.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {wishes.slice(0, 3).map((w) => (
              <li
                key={w.id}
                className={`flex items-center gap-2 text-[13px] serif italic text-ink/90 ${
                  justAdded === w.id ? "animate-fade-in" : ""
                }`}
              >
                <span style={{ color: "var(--color-mustard)" }}>✦</span>
                <span className="flex-1 truncate">{w.title}</span>
                <span className="small-caps text-[9px] text-sepia">this {w.period}</span>
              </li>
            ))}
          </ul>
        )}
      </section>



      {/* primary CTA — the one clear action */}
      <Link
        to="/collect"
        className="mt-7 block rounded-xl px-5 py-4 text-center serif transition hover:opacity-95"
        style={{
          backgroundColor: "var(--color-burgundy)",
          color: "var(--color-paper)",
          boxShadow: "0 6px 18px -10px var(--color-burgundy)",
        }}
      >
        <span className="small-caps block text-[10px] mb-1" style={{ color: "var(--color-mustard)", letterSpacing: "0.3em" }}>
          today's ritual
        </span>
        <span className="text-[17px] italic">
          Press today's moment into the book →
        </span>
      </Link>

      <div className="mt-3 text-center">
        <span className="cartouche text-[11px]">
          a museum of everything you've ever loved
        </span>
      </div>

      {/* yesterday quote */}
      <section className="mt-7">
        <div className="torn-note px-6 py-7 relative">
          <p className="text-[1.45rem] leading-snug serif text-ink">
            &ldquo;You said you wanted<br />to feel chosen.&rdquo;
          </p>
          <p className="mt-3 text-xs text-sepia serif italic">— Yesterday</p>
          <span className="absolute top-3 right-4 text-2xl" style={{ color: "var(--color-burgundy)", opacity: 0.7 }}>❦</span>
        </div>
      </section>

      {/* today's message — celestial */}
      <Section label="Today's message">
        <Link
          to="/collect"
          className="block rounded-lg overflow-hidden border hover:opacity-90 transition"
          style={{ borderColor: "var(--color-burgundy)" }}
        >
          <div className="celestial px-4 py-6 relative">
            <p className="serif text-[11px] tracking-[0.3em] uppercase" style={{ color: "oklch(0.85 0.08 90)" }}>
              A message arrived
            </p>
            <p className="mt-2 serif text-[18px] leading-snug" style={{ color: "oklch(0.95 0.03 85)" }}>
              &ldquo;Some things arrive slowly.&rdquo;
            </p>
            <span className="absolute top-3 right-4 text-xl" style={{ color: "var(--color-mustard)" }}>☾</span>
          </div>
        </Link>
      </Section>

      <Section label="Quiet reminder">
        <Card
          to="/correspondence"
          title="You haven't mentioned your painting recently. How is it?"
          glyph="✿"
          accent="moss"
        />
      </Section>

      {/* (B) bigger ritual — for serious long-term manifestations */}
      <Section label="Begin a manifestation">
        {!ritualOpen ? (
          <button
            onClick={() => setRitualOpen(true)}
            className="w-full rounded-xl px-5 py-5 text-left transition hover:opacity-95 relative overflow-hidden"
            style={{
              border: "1px dashed var(--color-burgundy)",
              backgroundColor: "oklch(0.98 0.012 88)",
            }}
          >
            <span className="absolute top-3 right-4 text-xl" style={{ color: "var(--color-mustard)" }}>✦</span>
            <span className="small-caps text-[10px]" style={{ color: "var(--color-burgundy)", letterSpacing: "0.3em" }}>
              + new manifestation
            </span>
            <p className="mt-2 serif italic text-[16px] text-ink">
              name something you're calling toward you.
            </p>
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addWish(ritualTitle, ritualPeriod);
              setRitualTitle("");
              setRitualPeriod("year");
              setRitualOpen(false);
            }}
            className="rounded-xl px-5 py-5 animate-scale-in"
            style={{
              border: "1px solid var(--color-burgundy)",
              backgroundColor: "var(--color-paper)",
            }}
          >
            <p className="small-caps mb-3" style={{ color: "var(--color-burgundy)" }}>
              what are you calling in?
            </p>
            <input
              autoFocus
              value={ritualTitle}
              onChange={(e) => setRitualTitle(e.target.value)}
              placeholder="this year, I will…"
              className="w-full bg-transparent outline-none serif italic text-[18px] text-ink placeholder:text-sepia/60 border-b py-2"
              style={{ borderColor: "var(--color-burgundy)" }}
            />
            <p className="small-caps mt-5 mb-2 text-sepia">by when</p>
            <div className="flex gap-2">
              {(["week", "month", "year"] as Period[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setRitualPeriod(p)}
                  className="flex-1 py-2 rounded-lg serif italic text-[13px] transition"
                  style={{
                    border: "1px solid var(--color-burgundy)",
                    backgroundColor: ritualPeriod === p ? "var(--color-burgundy)" : "transparent",
                    color: ritualPeriod === p ? "var(--color-paper)" : "var(--color-burgundy)",
                  }}
                >
                  this {p}
                </button>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => { setRitualOpen(false); setRitualTitle(""); }}
                className="text-xs serif italic text-sepia"
              >
                not yet
              </button>
              <button
                type="submit"
                disabled={!ritualTitle.trim()}
                className="px-4 py-2 rounded-full serif italic text-[13px] transition disabled:opacity-40"
                style={{ backgroundColor: "var(--color-burgundy)", color: "var(--color-paper)" }}
              >
                send to the universe ✦
              </button>
            </div>
          </form>
        )}
      </Section>

      <Section label="Recent pattern">
        <Card
          to="/constellations"
          title={<>You've been thinking about <em className="serif italic">"relationship"</em> a lot lately.</>}
          badge="4"
          accent="sky"
        />
      </Section>

      <div className="mt-10 ornament-rule text-sm">
        <span>❦</span>
      </div>
      <footer className="mt-4 text-center serif italic text-xs text-sepia">
        little by little, day by day,<br />
        what is meant for you will find its way.
      </footer>
    </PhoneFrame>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="small-caps mb-2">{label}</h2>
      {children}
    </section>
  );
}

function Card({
  to, title, glyph, badge, accent,
}: {
  to: "/collect" | "/correspondence" | "/constellations";
  title: React.ReactNode;
  glyph?: string;
  badge?: string;
  accent?: "moss" | "sky" | "burgundy" | "mustard";
}) {
  const accentColor =
    accent === "sky" ? "var(--color-sky)" :
    accent === "burgundy" ? "var(--color-burgundy)" :
    accent === "mustard" ? "var(--color-mustard)" :
    "var(--color-moss)";
  return (
    <Link to={to} className="block paper-card rounded-lg px-4 py-4 flex items-center gap-3 hover:opacity-90 transition">
      <div className="flex-1 min-w-0">
        <p className="text-[15px] serif text-ink leading-snug">{title}</p>
      </div>
      {glyph && (
        <span className="text-2xl shrink-0 serif" style={{ color: accentColor }}>{glyph}</span>
      )}
      {badge && (
        <span
          className="shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-xs serif"
          style={{ backgroundColor: accentColor, color: "var(--color-paper)" }}
        >
          {badge}
        </span>
      )}
      <ChevronRight className="h-4 w-4 text-sepia/60 shrink-0" strokeWidth={1.3} />
    </Link>
  );
}
