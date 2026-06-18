import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/correspondence")({
  head: () => ({
    meta: [
      { title: "Letters — Sísí" },
      { name: "description", content: "A quiet correspondence." },
    ],
  }),
  component: Correspondence,
});

type Msg = { from: "you" | "sisi"; text: string; time: string };

const seed: Msg[] = [
  { from: "you",  text: "I feel stuck lately.", time: "10:31 AM" },
  { from: "sisi", text: "Maybe not stuck. Maybe waiting.", time: "10:32 AM" },
  { from: "sisi", text: "You mentioned this same feeling three weeks ago.", time: "10:32 AM" },
  { from: "sisi", text: "Back then, you called it uncertainty.", time: "10:32 AM" },
  { from: "sisi", text: "What's different now?", time: "10:32 AM" },
];

function Message({ from, text, time }: Msg) {
  const isSisi = from === "sisi";
  return (
    <div className="mb-8">
      <p className="small-caps text-[10px] mb-2" style={{ color: "var(--color-muted-foreground)" }}>
        {isSisi ? "SÍSÍ" : "YOU"} · {time}
      </p>
      <p
        className={`text-base text-ink leading-relaxed ${
          isSisi ? "serif italic" : "font-sans"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

function Correspondence() {
  const [msgs, setMsgs] = useState(seed);
  const [draft, setDraft] = useState("");

  function send() {
    if (!draft.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setMsgs((m) => [...m, { from: "you", text: draft.trim(), time: now }]);
    setDraft("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "sisi", text: "i hear you. tell me more.", time: now }]);
    }, 900);
  }

  return (
    <PhoneFrame>
      <header className="pt-6 flex items-center justify-between mb-8">
        <Link to="/" className="text-xs small-caps" style={{ color: "var(--color-muted-foreground)" }}>
          ‹ home
        </Link>
        <p className="small-caps">letters</p>
        <span className="w-10" />
      </header>

      <div className="space-y-0">
        {msgs.map((m, i) => (
          <Message key={i} {...m} />
        ))}
      </div>

      {/* Reply input */}
      <div
        className="sticky bottom-20 mt-10 flex items-center gap-3 border-t pt-3 pb-1"
        style={{ background: "var(--color-paper)", borderColor: "var(--color-border)" }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="write to sísí…"
          className="flex-1 bg-transparent outline-none serif italic text-[14px] text-ink py-2"
          style={{ "::placeholder": { color: "var(--color-muted-foreground)" } } as React.CSSProperties}
        />
        <button
          onClick={send}
          disabled={!draft.trim()}
          className="text-xs small-caps disabled:opacity-30 transition-opacity"
          style={{ color: "var(--color-oxblood)" }}
        >
          send →
        </button>
      </div>
    </PhoneFrame>
  );
}
