import { createFileRoute } from "@tanstack/react-router";
import { Folder, Star } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { FoxScene } from "@/components/FoxScene";
import { BackButton } from "@/components/BackButton";

export const Route = createFileRoute("/stars/$id")({
  head: () => ({ meta: [{ title: "Star — sisi" }] }),
  component: StarDetail,
});

const labels: Record<string, string> = {
  s1: "Feeling at home",
  s2: "Creative life",
  s3: "Trusting myself",
  s4: "Feeling loved",
};

function StarDetail() {
  const { id } = Route.useParams();
  const label = labels[id] ?? "A star";

  return (
    <PhoneFrame hideTabs>
      <div className="relative min-h-[820px] pb-12">
        {/* full bleed warm photo */}
        <div className="absolute inset-0">
          <FoxScene name="path" rounded={false} className="h-full" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[40%] pointer-events-none"
             style={{ background: "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--mustard) 75%, transparent) 100%)" }} />

        <div className="relative z-10 p-5">
          <div className="flex items-center justify-between">
            <BackButton to="/stars" />
          </div>

          {/* avatar + title card row, matching screen 15 */}
          <div className="mt-16 flex items-center gap-3">
            <div className="h-[42px] w-[42px] rounded-full glass-card grid place-items-center">
              <Star size={16} className="text-mustard" fill="currentColor" />
            </div>
            <div className="flex-1 glass-card rounded-[14px] px-5 py-4">
              <p className="serif text-[1.05rem] leading-tight text-ink">{label}</p>
              <p className="mt-1 text-[11px] text-ink/55">Mentioned 23 times · since Apr</p>
            </div>
          </div>

          {/* meta rows */}
          <div className="mt-6 space-y-2">
            {[
              ["First noticed", "Apr 5, 2024"],
              ["Recent sign", "Yesterday"],
              ["Related postcards", "6"],
            ].map(([k, v]) => (
              <div key={k} className="glass-card rounded-[14px] px-5 py-4 flex justify-between items-center">
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink/55">{k}</span>
                <span className="serif text-[0.95rem] text-ink">{v}</span>
              </div>
            ))}
          </div>

          {/* big glass quote panel */}
          <div className="mt-8 glass-card rounded-[2rem] p-7">
            <p className="serif text-[1.35rem] leading-snug text-ink">
              You've come a long way.
            </p>
            <p className="mt-3 text-[12px] text-ink/55">
              The fox has paused here often. Each visit, a little brighter.
            </p>
          </div>

          {/* bottom action pills */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <button className="h-[56px] rounded-full pill-glass serif text-[15px]">
              View postcards
            </button>
            <button className="h-[56px] rounded-full pill-lavender serif text-[15px] flex items-center justify-center gap-2">
              <Folder size={16} /> Save
            </button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
