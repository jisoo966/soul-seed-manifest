import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/correspondence")({
  head: () => ({
    meta: [
      { title: "Correspondence — Sisi" },
      { name: "description", content: "Talk with Sisi. She remembers the little things." },
    ],
  }),
  component: Correspondence,
});

type Msg = { from: "you" | "sisi"; text: string; time: string };

const seed: Msg[] = [
  { from: "you", text: "I feel stuck lately.", time: "10:31 AM" },
  { from: "sisi", text: "Maybe not stuck.\nMaybe waiting.", time: "10:32 AM" },
  { from: "sisi", text: "You mentioned this same feeling three weeks ago.", time: "10:32 AM" },
  { from: "sisi", text: "Back then,\nyou called it uncertainty.", time: "10:32 AM" },
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
      setMsgs((m) => [
        ...m,
        { from: "sisi", text: "I hear you. Tell me more.", time: now },
      ]);
    }, 900);
  };

  return (
    <PhoneFrame>
      <header className="pt-4 flex items-center justify-between">
        <Link to="/" className="p-1"><ArrowLeft className="h-5 w-5 text-ink" strokeWidth={1.4} /></Link>
        <h1 className="text-lg serif text-ink">Correspondence</h1>
        <Mail className="h-5 w-5 text-ink" strokeWidth={1.4} />
      </header>

      <p className="mt-6 text-center small-caps">Today</p>

      <div className="mt-4 space-y-5">
        {msgs.map((m, i) => (
          <div key={i}>
            <p className="serif italic text-[13px] text-sepia mb-1">
              {m.from === "you" ? "You" : "Sisi"}
            </p>
            <p className="serif text-[16px] text-ink whitespace-pre-line leading-snug">
              {m.text}
            </p>
            <p className="text-[11px] text-sepia/70 mt-1 text-right">{m.time}</p>
          </div>
        ))}
      </div>

      <div className="fixed-bottom mt-8" />
      <div className="sticky bottom-20 mt-6 flex items-center gap-2 bg-paper/95 backdrop-blur rounded-full border border-border px-4 py-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Write to Sisi…"
          className="flex-1 bg-transparent outline-none serif italic text-sm placeholder:text-sepia/60 text-ink"
        />
        <button
          onClick={send}
          className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm"
          aria-label="Send"
        >✦</button>
      </div>
    </PhoneFrame>
  );
}
