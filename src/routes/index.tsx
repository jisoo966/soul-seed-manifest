import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

type Entry = { id: number; text: string; type: string | null; createdAt: string };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sísí — a quiet emotional archive" },
      { name: "description", content: "Plant your wishes, signs, dreams — sísí keeps them." },
      { property: "og:title", content: "Sísí" },
      { property: "og:description", content: "Plant your wishes, signs, dreams — sísí keeps them." },
    ],
  }),
  component: Home,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "good morning";
  if (h < 18) return "good afternoon";
  return "good evening";
}

function formatDatePill(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toLowerCase();
}

function Module({ label, body, italic = false }: { label: string; body: string; italic?: boolean }) {
  return (
    <div className="mb-6">
      <p className="small-caps text-[10px] mb-2" style={{ color: "var(--color-muted-foreground)" }}>
        — {label} —
      </p>
      <p className={`text-base serif text-ink leading-relaxed ${italic ? "italic" : ""}`}>
        {body}
      </p>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [yesterdayHighlight, setYesterdayHighlight] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem("sisi:onboarded")) {
      navigate({ to: "/onboarding", replace: true });
      return;
    }
    setName(window.localStorage.getItem("sisi:name") || "");

    const entries: Entry[] = JSON.parse(window.localStorage.getItem("sisi:entries") || "[]");
    if (entries.length > 0) setYesterdayHighlight(entries[0].text);
  }, [navigate]);

  const today = new Date();

  return (
    <PhoneFrame>
      {/* Date pill */}
      <div className="pt-6">
        <span className="cartouche text-xs serif italic" style={{ color: "var(--color-ink)", opacity: 0.7 }}>
          {formatDatePill(today)}
        </span>
      </div>

      {/* Greeting */}
      <h1 className="text-3xl serif italic text-ink mt-4 mb-8">
        {greeting()}{name ? `, ${name}.` : "."}
      </h1>

      {/* THE CARD — something stayed with me */}
      <div className="paper-card relative mb-10 px-6 py-8">
        <p className="small-caps text-[10px] text-center mb-2" style={{ color: "var(--color-olive)" }}>
          — something stayed with me —
        </p>
        <div className="ornament-rule mb-4" />
        <blockquote className="text-lg serif italic text-ink text-center leading-snug">
          "{yesterdayHighlight || "what did you notice yesterday?"}"
        </blockquote>
        <p className="text-xs serif italic text-center mt-4" style={{ color: "var(--color-muted-foreground)" }}>
          — from yesterday
        </p>
        <Link
          to="/correspondence"
          className="block text-xs small-caps text-right mt-2"
          style={{ color: "var(--color-gold)" }}
        >
          revisit ›
        </Link>
      </div>

      {/* 3 modules */}
      <Module
        label="TODAY'S MESSAGE"
        body='"some things arrive slowly."'
        italic
      />
      <Module
        label="QUIET REMINDER"
        body="you haven't mentioned your painting recently. how is it?"
        italic
      />
      <Module
        label="RECENT PATTERN"
        body="you've been thinking about relationship a lot lately."
        italic
      />

      {/* Bottom CTA */}
      <div className="ink-divider mt-12 mb-6" />
      <Link
        to="/collect"
        className="block text-center text-lg serif italic py-4"
        style={{ color: "var(--color-oxblood)" }}
      >
        ✦  plant something today
      </Link>
    </PhoneFrame>
  );
}
