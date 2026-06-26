import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { FoxScene } from "@/components/FoxScene";
import { BackButton } from "@/components/BackButton";

export const Route = createFileRoute("/capture")({
  head: () => ({ meta: [{ title: "Capture — sisi" }] }),
  component: Capture,
});

function Capture() {
  const navigate = useNavigate();
  const [note, setNote] = useState("");

  const save = () => {
    if (typeof window !== "undefined" && note.trim()) {
      window.localStorage.setItem("sisi:todayFeeling", note.trim());
    }
    navigate({ to: "/postcards" });
  };

  return (
    <PhoneFrame hideTabs>
      <div className="relative h-full min-h-[820px]">
        <div className="absolute inset-0">
          <FoxScene name="stopped" rounded={false} className="h-full" />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--mustard) 85%, transparent) 100%)",
          }}
        />

        <div className="absolute top-3 left-5 z-10">
          <BackButton to="/" />
        </div>

        {/* glass write card */}
        <div className="absolute left-5 right-5 bottom-28 z-10">
          <div className="glass-card rounded-[2.2rem] p-7">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
              Worth holding on to
            </p>
            <textarea
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="I want to remember…"
              rows={4}
              className="w-full mt-3 bg-transparent serif text-[1.2rem] leading-snug text-ink outline-none resize-none placeholder:text-ink/35"
            />
          </div>
        </div>

        {/* Done */}
        <button
          onClick={save}
          className="absolute right-5 bottom-10 z-10 h-[52px] min-w-[88px] px-6 rounded-full pill-lavender grid place-items-center shadow-md serif text-[15px]"
        >
          Done
        </button>
      </div>
    </PhoneFrame>
  );
}
