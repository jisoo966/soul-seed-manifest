import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/collect")({
  head: () => ({
    meta: [
      { title: "Collect — Sísí" },
      { name: "description", content: "Plant something today." },
    ],
  }),
  component: Collect,
});

const ENTRY_TYPES = [
  { id: "sign",          label: "a sign" },
  { id: "synchronicity", label: "a synchronicity" },
  { id: "wish",          label: "a wish" },
  { id: "dream",         label: "a dream" },
  { id: "thought",       label: "a thought" },
  { id: "memory",        label: "a memory" },
];

function Collect() {
  const navigate = useNavigate();
  const [entry, setEntry] = useState("");
  const [type, setType] = useState<string | null>(null);

  function handlePlant() {
    const trimmed = entry.trim();
    if (!trimmed) return;
    if (typeof window !== "undefined") {
      const entries = JSON.parse(window.localStorage.getItem("sisi:entries") || "[]");
      entries.unshift({ id: Date.now(), text: trimmed, type, createdAt: new Date().toISOString() });
      window.localStorage.setItem("sisi:entries", JSON.stringify(entries));
    }
    navigate({
      to: "/constellations",
      search: { landing: true, title: trimmed.slice(0, 60), kind: type ?? "thought" },
    });
  }

  return (
    <PhoneFrame>
      <div className="px-2 py-8 min-h-screen flex flex-col">
        <Link to="/" className="text-xs small-caps mb-8 block" style={{ color: "var(--color-muted-foreground)" }}>
          ‹ home
        </Link>

        <h1 className="text-2xl serif italic text-ink mb-2">
          what's on your mind today?
        </h1>

        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          rows={8}
          className="bg-transparent border-b text-base serif text-ink py-4 mb-8 resize-none focus:outline-none w-full"
          style={{ borderColor: "var(--color-border)" }}
          placeholder="write a line, or a paragraph. whatever fits."
          autoFocus
        />

        {/* Optional type tags */}
        <p className="small-caps text-[10px] mb-3" style={{ color: "var(--color-muted-foreground)" }}>
          optionally, mark this as:
        </p>
        <div className="grid grid-cols-3 gap-2 mb-12">
          {ENTRY_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id === type ? null : t.id)}
              className="text-sm serif italic py-2 px-3 border transition-colors"
              style={{
                borderColor: type === t.id ? "var(--color-gold)" : "rgba(31,42,68,0.2)",
                color: type === t.id ? "var(--color-oxblood)" : "var(--color-ink)",
                opacity: type === t.id ? 1 : 0.6,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={handlePlant}
          disabled={!entry.trim()}
          className="text-lg serif italic disabled:opacity-30 transition-opacity self-end mt-auto"
          style={{ color: "var(--color-oxblood)" }}
        >
          plant ✦
        </button>
      </div>
    </PhoneFrame>
  );
}
