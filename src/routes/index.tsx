import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { FoxScene } from "@/components/FoxScene";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "sisi — a journey with your inner companion" },
      { name: "description", content: "Walk with your fox each day." },
    ],
  }),
  component: Journey,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Late evening";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Journey() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [feeling, setFeeling] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem("sisi:onboarded")) {
      navigate({ to: "/onboarding", replace: true });
      return;
    }
    setName(window.localStorage.getItem("sisi:name") || "");
    setFeeling(window.localStorage.getItem("sisi:todayFeeling") || "");
  }, [navigate]);

  return (
    <PhoneFrame>
      <header className="px-6 pt-4">
        <h1 className="serif text-[1.7rem] leading-tight text-ink">
          {greeting()}{name ? `, ${name}` : ""}
        </h1>
        <p className="mt-2 serif text-[1.05rem] text-ink/55 leading-snug">
          Shall we take<br />another step today?
        </p>
      </header>

      <div className="px-5 mt-5 relative">
        <FoxScene name="home" className="aspect-[4/5]" />

        {/* glass card overlapping the hero */}
        <div className="absolute left-8 right-8 bottom-6 glass-card rounded-[1.6rem] p-5 pr-20">
          <p className="text-[10px] tracking-[0.2em] uppercase text-ink/55">Today you felt</p>
          <p className="mt-1 serif text-[1.05rem] text-ink leading-snug">
            {feeling || "tap to capture this moment"}
          </p>
          <Link
            to="/capture"
            aria-label="Capture"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full pill-lavender grid place-items-center shadow"
          >
            <Plus size={18} strokeWidth={1.8} />
          </Link>
        </div>
      </div>

      <div className="px-5 mt-6">
        <p className="px-1 text-[10px] tracking-[0.22em] uppercase text-ink/55 mb-3">
          A message arrived
        </p>
        <Link
          to="/messages"
          className="block glass-card rounded-[1.4rem] p-5"
        >
          <p className="serif text-[1.05rem] text-ink leading-relaxed">
            "Memories don't always fade.<br />They just change where they live."
          </p>
          <p className="mt-3 text-[11px] text-ink/55">from your fox · today</p>
        </Link>
      </div>

      <footer className="mt-8 mb-4 text-center px-6">
        <p className="text-[11px] text-ink/45 tracking-wide">
          every step becomes part of you.
        </p>
      </footer>
    </PhoneFrame>
  );
}
