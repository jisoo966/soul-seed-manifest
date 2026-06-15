import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/correspondence")({
  head: () => ({
    meta: [
      { title: "Letters — Sisi" },
      { name: "description", content: "A quiet correspondence." },
    ],
  }),
  component: Correspondence,
});

type Msg = { from: "you" | "sisi"; text: string; time: string };

const seed: Msg[] = [
  { from: "you", text: "I feel stuck lately.", time: "10:31 AM" },
  { from: "sisi", text: "Maybe not stuck. Maybe waiting.", time: "10:32 AM" },
  { from: "sisi", text: "You mentioned this same feeling three weeks ago.", time: "10:32 AM" },
  { from: "sisi", text: "Back then, you called it uncertainty.", time: "10:32 AM" },
  { from: "sisi", text: "What's different now?", time: "10:32 AM" },
];

function Correspondence() {
  const [msgs, setMsgs] = useState(seed);
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setMsgs((m) => [...m, { from: "you", text: draft.trim(), time: now }]);
    setDraft("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "sisi", text: "I hear you. Tell me more.", time: now }]);
    }, 900);
  };

  return (
    <PhoneFrame>
      <header className="pt-6 flex items-center justify-between">
        <Link to="/" className="text-[11px] tracking-[0.22em] uppercase text-ink">← Back</Link>
        <p className="small-caps">Letters</p>
        <span className="w-10" />
      </header>

      <p className="mt-8 text-center small-caps">Today</p>

      <div className="mt-6 space-y-6">
        {msgs.map((m, i) => (
          <div key={i}>
            <p className="small-caps mb-1.5">
              {m.from === "you" ? "You" : "Sisi"} · {m.time}
            </p>
            <p className="serif text-[15px] text-ink whitespace-pre-line leading-[1.5]">
              {m.text}
            </p>
          </div>
        ))}
      </div>

      <div className="sticky bottom-20 mt-10 flex items-center gap-3 bg-paper border-t border-border pt-3 pb-1">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Write to Sisi…"
          className="flex-1 bg-transparent outline-none serif text-[14px] placeholder:text-sepia/60 text-ink py-2"
        />
        <button
          onClick={send}
          disabled={!draft.trim()}
          className="text-[11px] tracking-[0.22em] uppercase text-ink disabled:opacity-30"
          aria-label="Send"
        >
          Send →
        </button>
      </div>
    </PhoneFrame>
  );
}
