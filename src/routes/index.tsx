import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";

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
  return (
    <PhoneFrame>
      <header className="pt-6">
        <p className="small-caps mb-2" style={{ color: "var(--color-burgundy)" }}>No. 47 · June</p>
        <h1 className="text-[2rem] leading-tight text-ink serif">
          Good morning, <em className="font-light">Jisoo</em>.
        </h1>
        <p className="mt-2 text-sm text-sepia serif italic">
          Something from yesterday stayed with me.
          <span className="float-right text-lg not-italic" style={{ color: "var(--color-mustard)" }}>✦</span>
        </p>
      </header>

      {/* burgundy cartouche — the museum sticker */}
      <div className="mt-7 text-center">
        <span className="cartouche text-[13px]">
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
