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
        <p className="mt-2 serif text-[1.05rem] text-sepia leading-snug">
          Shall we take<br />another step today?
        </p>
      </header>

      <div className="px-6 mt-5">
        <FoxScene name="home" className="aspect-[4/5]" />
      </div>

      <div className="px-6 mt-5">
        <Link
          to="/capture"
          className="block paper-card rounded-[1.25rem] p-4 pr-16 relative hover:border-primary/40 transition"
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-sepia">Today you felt</p>
          <p className="mt-1 serif text-[1.05rem] text-ink">
            {feeling || "tap to capture this moment"}
          </p>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <Plus size={18} strokeWidth={1.8} />
          </span>
        </Link>
      </div>

      <div className="px-6 mt-8">
        <p className="small-caps mb-3">A message arrived</p>
        <Link
          to="/messages"
          className="block rounded-[1.25rem] border border-border bg-muted/40 p-4 hover:bg-muted transition"
        >
          <p className="serif text-[1rem] text-ink leading-relaxed">
            "Memories don't always fade. They just change where they live."
          </p>
          <p className="mt-2 text-[11px] text-sepia">from your fox · today</p>
        </Link>
      </div>

      <footer className="mt-10 mb-2 text-center px-6">
        <p className="text-[11px] text-sepia tracking-wide">
          every step becomes part of you.
        </p>
      </footer>
    </PhoneFrame>
  );
}
