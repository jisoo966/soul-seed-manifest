import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { DottedGlyph } from "@/components/DottedGlyph";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Sisi" },
      { name: "description", content: "Your Sisi account, subscription and settings." },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <PhoneFrame>
      <header className="pt-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1 text-sepia serif italic text-sm">
          <ChevronLeft className="h-4 w-4" strokeWidth={1.3} /> back
        </Link>
        <p className="small-caps" style={{ color: "var(--color-burgundy)" }}>your account</p>
        <span className="w-10" />
      </header>

      {/* identity */}
      <section className="mt-8 text-center">
        <div
          className="mx-auto h-20 w-20 rounded-full flex items-center justify-center serif text-3xl"
          style={{
            backgroundColor: "var(--color-burgundy)",
            color: "var(--color-paper)",
            boxShadow: "0 8px 20px -10px var(--color-burgundy)",
          }}
        >
          J
        </div>
        <h1 className="mt-3 text-[1.6rem] leading-tight text-ink serif">
          <em className="font-light">Jisoo</em>
        </h1>
        <p className="mt-1 text-xs text-sepia serif italic">
          quietly manifesting since June 2026
        </p>
        <div className="mt-3">
          <span className="cartouche text-[11px]">jisoo@sisi.app</span>
        </div>
      </section>

      {/* journey numbers */}
      <section className="mt-8 grid grid-cols-3 gap-2">
        <Stat label="moments" value="47" />
        <Stat label="signs" value="12" />
        <Stat label="manifested" value="3" />
      </section>

      {/* subscription */}
      <Section label="Your subscription">
        <div
          className="rounded-xl px-5 py-5 relative overflow-hidden"
          style={{
            backgroundColor: "var(--color-burgundy)",
            color: "var(--color-paper)",
          }}
        >
          <span className="absolute top-3 right-4 text-xl" style={{ color: "var(--color-mustard)" }}><DottedGlyph variant="star" size={20} /></span>
          <p className="small-caps text-[10px]" style={{ color: "var(--color-mustard)", letterSpacing: "0.3em" }}>
            sisi · celestial
          </p>
          <p className="mt-2 text-[18px] serif italic">
            unlimited manifestations
          </p>
          <p className="mt-1 text-[12px] serif opacity-80">
            renews September 14 · $4.99/month
          </p>
          <button
            className="mt-4 text-[11px] serif italic underline underline-offset-2 opacity-90"
          >
            manage subscription →
          </button>
        </div>
      </Section>

      {/* settings */}
      <Section label="Settings">
        <Row title="Daily ritual reminder" hint="9:00 AM" />
        <Row title="Voice & tone" hint="soft" />
        <Row title="Notifications" hint="gentle" />
        <Row title="Appearance" hint="paper" />
        <Row title="Language" hint="한국어" />
      </Section>

      <Section label="Your world">
        <Row title="Export your archive" />
        <Row title="Privacy" />
        <Row title="Help & feedback" />
        <Row title="About Sisi" />
      </Section>

      <div className="mt-8 text-center">
        <button className="text-xs serif italic text-sepia underline underline-offset-2">
          sign out
        </button>
      </div>

      <div className="mt-8 ornament-rule text-sm">
        <span><DottedGlyph variant="fleuron" size={22} /></span>
      </div>
      <footer className="mt-3 mb-2 text-center serif italic text-[11px] text-sepia">
        kept softly, between you and the universe.
      </footer>
    </PhoneFrame>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="small-caps mb-2">{label}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="paper-card rounded-lg py-3 text-center">
      <p className="serif text-[1.4rem] text-ink leading-none">{value}</p>
      <p className="mt-1 small-caps text-[9px]">{label}</p>
    </div>
  );
}

function Row({ title, hint }: { title: string; hint?: string }) {
  return (
    <button className="w-full paper-card rounded-lg px-4 py-3 flex items-center gap-3 hover:opacity-90 transition text-left">
      <span className="flex-1 text-[14px] serif text-ink">{title}</span>
      {hint && <span className="text-[12px] serif italic text-sepia">{hint}</span>}
      <ChevronRight className="h-4 w-4 text-sepia/60 shrink-0" strokeWidth={1.3} />
    </button>
  );
}
