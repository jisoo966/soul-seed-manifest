import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/constellations")({
  head: () => ({
    meta: [
      { title: "Constellations — Sisi" },
      { name: "description", content: "See the patterns. Connect the dots." },
    ],
  }),
  component: Constellations,
});

const nodes = [
  { id: "dream", label: "Dream", date: "Mar 3", x: 50, y: 18 },
  { id: "thought", label: "Thought", date: "Mar 15", x: 15, y: 45 },
  { id: "sign", label: "Sign", date: "Mar 20", x: 85, y: 45 },
  { id: "you", label: "You", date: "", x: 50, y: 60, primary: true },
  { id: "manifestation", label: "Manifestation", date: "Jun 10", x: 80, y: 88 },
];

const edges: Array<[string, string]> = [
  ["dream", "thought"],
  ["dream", "sign"],
  ["thought", "you"],
  ["sign", "you"],
  ["you", "manifestation"],
];

function Constellations() {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <PhoneFrame>
      <header className="pt-4 flex items-center justify-between">
        <Link to="/" className="p-1"><ArrowLeft className="h-5 w-5 text-ink" strokeWidth={1.4} /></Link>
        <h1 className="text-lg serif text-ink">Constellations</h1>
        <button className="p-1"><Plus className="h-5 w-5 text-ink" strokeWidth={1.4} /></button>
      </header>

      {/* selected constellation header */}
      <div className="paper-card rounded-lg mt-6 px-4 py-4 flex gap-3">
        <div className="h-14 w-14 rounded-full overflow-hidden bg-secondary flex items-center justify-center text-2xl serif text-moss">
          ❦
        </div>
        <div className="flex-1">
          <p className="serif text-[17px] text-ink">Relationship</p>
          <p className="text-[11px] text-sepia italic serif">7 Entries</p>
          <p className="text-[12px] text-ink/80 mt-1 serif">You mentioned this 4 times.</p>
          <p className="text-[11px] text-sepia serif italic">First appeared: March 3</p>
          <p className="text-[11px] text-sepia serif italic">Most recent: June 10</p>
        </div>
      </div>

      {/* constellation graph */}
      <div className="relative mt-6 paper-card rounded-xl aspect-[3/4] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {edges.map(([a, b], i) => {
            const A = byId[a], B = byId[b];
            return (
              <line
                key={i}
                x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke="oklch(0.55 0.03 70)"
                strokeWidth={0.25}
                strokeDasharray="1 1"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        {nodes.map((n) => (
          <div
            key={n.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <div
              className={`rounded-full flex items-center justify-center serif ${
                n.primary
                  ? "h-14 w-14 bg-primary text-primary-foreground text-[13px]"
                  : "h-12 w-12 bg-secondary text-ink text-[12px]"
              }`}
              style={{ boxShadow: "0 4px 12px -6px oklch(0.3 0.05 60 / 0.4)" }}
            >
              {n.label}
            </div>
            {n.date && (
              <span className="mt-1 text-[10px] serif italic text-sepia">{n.date}</span>
            )}
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}
