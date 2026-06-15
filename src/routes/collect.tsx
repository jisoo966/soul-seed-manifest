import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/collect")({
  head: () => ({
    meta: [
      { title: "Write — Sisi" },
      { name: "description", content: "Today's entry." },
    ],
  }),
  component: Collect,
});

const kinds = ["Sign", "Sync", "Wish", "Dream", "Thought", "Memory"];

const recent = [
  { title: "Saw a white feather on my way to work.", when: "Today, 8:42 AM" },
  { title: "The interview went better than I expected.", when: "Yesterday, 3:11 PM" },
];

function Collect() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [kind, setKind] = useState<string | null>("Sign");
  const canSubmit = text.trim().length > 0 && kind;

  return (
    <PhoneFrame>
      <header className="pt-6 flex items-center justify-between">
        <Link to="/" className="text-[11px] tracking-[0.22em] uppercase text-ink">
          ← Back
        </Link>
        <p className="small-caps">New entry</p>
        <span className="w-10" />
      </header>

      <div className="mt-8">
        <p className="small-caps mb-3">Write</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 280))}
          placeholder="A white feather on the sidewalk. The song you wished for, on the radio…"
          rows={6}
          className="w-full bg-transparent outline-none serif text-[15px] text-ink placeholder:text-sepia/50 leading-relaxed resize-none border-b border-border focus:border-ink transition-colors pb-2"
        />
        <p className="mt-2 text-right text-[10px] text-sepia tracking-wide">{text.length}/280</p>
      </div>

      <div className="mt-8">
        <p className="small-caps mb-3">Kind</p>
        <div className="flex flex-wrap gap-2">
          {kinds.map((label) => {
            const active = kind === label;
            return (
              <button
                key={label}
                onClick={() => setKind(label)}
                className="px-3 py-1.5 rounded-full border serif text-[12px] transition"
                style={{
                  borderColor: active ? "var(--color-ink)" : "var(--color-border)",
                  backgroundColor: active ? "var(--color-ink)" : "transparent",
                  color: active ? "var(--color-paper)" : "var(--color-ink)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        disabled={!canSubmit}
        onClick={() => {
          const title = text.trim().slice(0, 60);
          setText("");
          navigate({
            to: "/constellations",
            search: { landing: "1", title, kind: kind ?? "Sign" },
          });
        }}
        className="mt-10 w-full py-4 border border-ink text-ink serif text-[14px] tracking-[0.05em] rounded-md transition disabled:opacity-30 hover:bg-ink hover:text-paper disabled:hover:bg-transparent disabled:hover:text-ink"
      >
        Save entry
      </button>

      <div className="mt-12 ink-divider" />

      <p className="small-caps mt-8 mb-4">Earlier</p>
      <div className="space-y-5">
        {recent.map((r) => (
          <div key={r.title}>
            <p className="serif text-[14px] text-ink leading-snug">{r.title}</p>
            <p className="text-[10px] text-sepia mt-1 tracking-wide">{r.when}</p>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}
