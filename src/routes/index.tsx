import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sisi — soft reminders that find you" },
      { name: "description", content: "Sisi is a quiet companion that helps you manifest your wish — soft reminders, captured moments, and the patterns of your inner world." },
      { property: "og:title", content: "Sisi — soft reminders that find you" },
      { property: "og:description", content: "A friend, checking in. Capture meaningful moments and watch your inner world take shape." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PhoneFrame>
      <header className="pt-6">
        <h1 className="text-[2rem] leading-tight text-ink">
          Good morning, <em className="font-light">Jisoo</em>.
        </h1>
        <p className="mt-2 text-sm text-sepia serif italic">
          Something from yesterday stayed with me.
          <span className="float-right text-lg not-italic">✦</span>
        </p>
      </header>

      {/* yesterday quote */}
      <section className="mt-7">
        <div className="torn-note px-6 py-7 relative">
          <p className="text-[1.45rem] leading-snug serif text-ink">
            &ldquo;You said you wanted<br />to feel chosen.&rdquo;
          </p>
          <p className="mt-3 text-xs text-sepia serif italic">— Yesterday</p>
          <span className="absolute top-3 right-4 text-2xl opacity-60">❦</span>
        </div>
      </section>

      {/* today's message */}
      <Section label="Today's message">
        <Card
          to="/collect"
          title="“Some things arrive slowly.”"
          eyebrow="A message arrived."
          glyph="☾"
        />
      </Section>

      <Section label="Quiet reminder">
        <Card
          to="/correspondence"
          title="You haven't mentioned your painting recently. How is it?"
          glyph="✿"
        />
      </Section>

      <Section label="Recent pattern">
        <Card
          to="/constellations"
          title={<>You've been thinking about <em className="serif">“relationship”</em> a lot lately.</>}
          badge="4"
        />
      </Section>

      <footer className="mt-10 text-center serif italic text-xs text-sepia">
        your inner world is worth remembering
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
  to, title, eyebrow, glyph, badge,
}: {
  to: "/collect" | "/correspondence" | "/constellations";
  title: React.ReactNode;
  eyebrow?: string;
  glyph?: string;
  badge?: string;
}) {
  return (
    <Link to={to} className="block paper-card rounded-lg px-4 py-4 flex items-center gap-3 hover:opacity-90 transition">
      <div className="flex-1 min-w-0">
        {eyebrow && <p className="text-[11px] serif italic text-sepia mb-1">{eyebrow}</p>}
        <p className="text-[15px] serif text-ink leading-snug">{title}</p>
      </div>
      {glyph && (
        <span className="text-2xl text-moss/70 shrink-0 serif">{glyph}</span>
      )}
      {badge && (
        <span className="shrink-0 h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs serif text-ink">
          {badge}
        </span>
      )}
      <ChevronRight className="h-4 w-4 text-sepia/60 shrink-0" strokeWidth={1.3} />
    </Link>
  );
}
