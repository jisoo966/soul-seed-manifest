import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { FoxScene } from "@/components/FoxScene";

export const Route = createFileRoute("/postcards")({
  head: () => ({ meta: [{ title: "Postcards — sisi" }] }),
  component: Postcards,
});

const cards = [
  { id: "1", scene: "meadow", note: "Today, I felt grateful for the small things.", date: "Jun 24" },
  { id: "2", scene: "path", note: "The breeze felt like a hug.", date: "Jun 20" },
  { id: "3", scene: "stars-night", note: "Trust the path you're on.", date: "Jun 18" },
  { id: "4", scene: "home", note: "I want to remember this feeling.", date: "Jun 15" },
  { id: "5", scene: "stopped", note: "A quiet afternoon.", date: "Jun 12" },
  { id: "6", scene: "talking", note: "You've walked a long way.", date: "Jun 9" },
] as const;

function Postcards() {
  return (
    <PhoneFrame>
      <header className="px-6 pt-4">
        <p className="text-center small-caps">Postcards</p>
        <p className="text-center mt-1 text-[11px] text-sepia">{cards.length} collected</p>
      </header>

      <div className="px-6 mt-6 grid grid-cols-3 gap-3">
        {cards.map((c) => (
          <Link
            key={c.id}
            to="/postcards/$id"
            params={{ id: c.id }}
            className="aspect-[3/4] block"
          >
            <FoxScene name={c.scene} className="h-full" />
          </Link>
        ))}
      </div>

      <div className="px-6 mt-8">
        <Link
          to="/capture"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-primary-foreground text-[13px] tracking-wide hover:opacity-90 transition"
        >
          <Plus size={16} /> new memory
        </Link>
      </div>
    </PhoneFrame>
  );
}
