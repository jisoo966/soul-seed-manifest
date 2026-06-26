import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, Plus } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { FoxScene } from "@/components/FoxScene";

export const Route = createFileRoute("/stars")({
  head: () => ({ meta: [{ title: "My Stars — sisi" }] }),
  component: Stars,
});

const baseStars = [
  { id: "s1", label: "Feeling at home", x: 50, y: 18 },
  { id: "s2", label: "Creative life", x: 20, y: 48 },
  { id: "s3", label: "Trusting myself", x: 80, y: 48 },
  { id: "s4", label: "Feeling loved", x: 50, y: 78 },
];

function Stars() {
  const [primary, setPrimary] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPrimary(window.localStorage.getItem("sisi:primaryStar") || "Feeling at home");
  }, []);

  return (
    <PhoneFrame>
      <header className="px-6 pt-4 text-center">
        <h1 className="serif text-[1.5rem] text-ink">My Stars</h1>
        <p className="mt-1 text-[11px] text-sepia">the directions you follow</p>
      </header>

      <div className="px-6 mt-6">
        <FoxScene name="stars-night" className="aspect-square">
          {baseStars.map((s) => (
            <div
              key={s.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              <Star
                size={s.label === primary ? 22 : 16}
                className="mx-auto text-mustard"
                fill="currentColor"
              />
              <p className="mt-1 text-[10px] text-paper/80 whitespace-nowrap">{s.label}</p>
            </div>
          ))}
        </FoxScene>
      </div>

      <ul className="mt-6 px-6 space-y-2">
        {baseStars.map((s) => (
          <li key={s.id}>
            <Link
              to="/stars/$id"
              params={{ id: s.id }}
              className="flex items-center gap-3 rounded-full border border-border bg-paper px-4 py-3 hover:border-primary/40 transition"
            >
              <Star
                size={14}
                className={s.label === primary ? "text-primary" : "text-sepia"}
                fill={s.label === primary ? "currentColor" : "none"}
              />
              <span className="serif text-[0.95rem] text-ink flex-1">{s.label}</span>
            </Link>
          </li>
        ))}
        <li>
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-dashed border-border text-sepia text-[12px] hover:border-primary/40 transition">
            <Plus size={14} /> follow a new star
          </button>
        </li>
      </ul>
    </PhoneFrame>
  );
}
