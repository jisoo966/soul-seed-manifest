import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Account — Sisi" },
      { name: "description", content: "Your account and settings." },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <PhoneFrame>
      <header className="pt-6 flex items-center justify-between">
        <Link to="/" className="text-[11px] tracking-[0.22em] uppercase text-ink">← Back</Link>
        <p className="small-caps">Account</p>
        <span className="w-10" />
      </header>

      <section className="mt-10 text-center">
        <div className="mx-auto h-16 w-16 rounded-full border border-border flex items-center justify-center serif text-[1.4rem] text-ink">
          J
        </div>
        <h1 className="mt-4 serif text-[1.6rem] leading-tight text-ink">Jisoo</h1>
        <p className="mt-1 text-[11px] text-sepia tracking-wide">
          quietly journaling since June 2026
        </p>
        <p className="mt-3 text-[11px] text-sepia">jisoo@sisi.app</p>
      </section>

      <div className="mt-10 ink-divider" />

      <section className="mt-8 grid grid-cols-3 gap-0 divide-x divide-border">
        <Stat label="entries" value="47" />
        <Stat label="signs" value="12" />
        <Stat label="kept" value="3" />
      </section>

      <div className="mt-8 ink-divider" />

      <Section label="Subscription">
        <div className="py-5">
          <p className="serif text-[15px] text-ink">Sisi · Yearly</p>
          <p className="mt-1 text-[11px] text-sepia">
            Renews September 14 · $4.99/month
          </p>
          <button className="mt-3 text-[11px] tracking-[0.22em] uppercase text-ink">
            Manage →
          </button>
        </div>
      </Section>

      <Section label="Settings">
        <Row title="Daily reminder" hint="9:00 AM" />
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

      <div className="mt-10 text-center">
        <button className="text-[11px] tracking-[0.22em] uppercase text-sepia">
          Sign out
        </button>
      </div>

      <footer className="mt-10 mb-4 text-center text-[11px] text-sepia tracking-wide">
        kept softly, between you and the page.
      </footer>
    </PhoneFrame>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <p className="small-caps">{label}</p>
      <div className="mt-2 divide-y divide-border border-t border-b border-border">{children}</div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2 text-center">
      <p className="serif text-[1.5rem] text-ink leading-none">{value}</p>
      <p className="mt-1 small-caps text-[9px]">{label}</p>
    </div>
  );
}

function Row({ title, hint }: { title: string; hint?: string }) {
  return (
    <button className="w-full py-3.5 flex items-center gap-3 text-left hover:opacity-60 transition">
      <span className="flex-1 text-[14px] serif text-ink">{title}</span>
      {hint && <span className="text-[12px] text-sepia">{hint}</span>}
      <span className="text-sepia text-[12px]">→</span>
    </button>
  );
}
