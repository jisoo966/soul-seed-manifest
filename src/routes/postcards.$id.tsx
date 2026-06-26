import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Share, Star } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { FoxScene } from "@/components/FoxScene";

export const Route = createFileRoute("/postcards/$id")({
  head: () => ({ meta: [{ title: "Postcard — sisi" }] }),
  component: PostcardDetail,
});

function PostcardDetail() {
  const { id } = Route.useParams();
  return (
    <PhoneFrame>
      <header className="px-6 pt-4 flex items-center justify-between">
        <Link to="/postcards" className="text-ink">
          <ArrowLeft size={20} />
        </Link>
        <button className="text-sepia"><Share size={18} /></button>
      </header>

      <div className="px-6 mt-6">
        <div className="relative rounded-[1.25rem] bg-paper border border-border p-3 shadow-sm">
          <div className="absolute top-2 right-2 rounded border border-border bg-muted/60 px-2 py-1 text-[9px] tracking-widest text-sepia">
            POST · {id.padStart(3, "0")}
          </div>
          <FoxScene name="meadow" className="aspect-[4/3]" />
          <p className="mt-4 text-[11px] text-sepia">Today, I felt…</p>
          <p className="mt-1 serif text-[1.15rem] text-ink leading-snug">
            grateful for the small things around me.
          </p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[11px] text-sepia">Apr 20, 2024</p>
            <span className="inline-flex items-center gap-1 text-mustard">
              <Star size={14} fill="currentColor" />
              <span className="text-[11px] text-sepia">Feeling at home</span>
            </span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
