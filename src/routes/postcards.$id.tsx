import { createFileRoute } from "@tanstack/react-router";
import { FolderPlus } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { FoxScene } from "@/components/FoxScene";
import { BackButton } from "@/components/BackButton";

export const Route = createFileRoute("/postcards/$id")({
  head: () => ({ meta: [{ title: "Postcard — sisi" }] }),
  component: PostcardDetail,
});

function PostcardDetail() {
  return (
    <PhoneFrame hideTabs>
      <div className="relative h-full min-h-[820px]">
        {/* hero image full bleed */}
        <div className="absolute inset-0">
          <FoxScene name="meadow" rounded={false} className="h-full" />
        </div>

        {/* golden fade to bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--mustard) 0%, transparent) 0%, color-mix(in oklab, var(--mustard) 85%, transparent) 100%)",
          }}
        />

        {/* back */}
        <div className="absolute top-3 left-5 z-10">
          <BackButton to="/postcards" />
        </div>

        {/* glass info card */}
        <div className="absolute left-5 right-5 bottom-28 z-10">
          <div className="glass-card rounded-[2.2rem] p-7">
            <p className="serif text-[1.65rem] leading-tight text-ink">
              Worth Holding<br />On To
            </p>
            <p className="mt-4 text-[12px] text-ink/55 leading-relaxed">
              A small moment you didn't want to lose. The fox kept walking,<br />
              but this stayed.
            </p>
          </div>
        </div>

        {/* save chip */}
        <button className="absolute right-5 bottom-10 z-10 h-[52px] w-[52px] rounded-full pill-lavender grid place-items-center shadow-md">
          <FolderPlus size={20} strokeWidth={1.8} />
        </button>
      </div>
    </PhoneFrame>
  );
}
