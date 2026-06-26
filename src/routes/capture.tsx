import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { X, Camera } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { FoxScene } from "@/components/FoxScene";

export const Route = createFileRoute("/capture")({
  head: () => ({ meta: [{ title: "Capture — sisi" }] }),
  component: Capture,
});

function Capture() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"stopped" | "write">("stopped");
  const [note, setNote] = useState("");

  const save = () => {
    if (typeof window !== "undefined" && note.trim()) {
      window.localStorage.setItem("sisi:todayFeeling", note.trim());
    }
    navigate({ to: "/postcards" });
  };

  return (
    <PhoneFrame hideTabs>
      <header className="px-6 pt-4 flex items-center justify-between">
        <button onClick={() => navigate({ to: "/" })} aria-label="Close" className="text-ink">
          <X size={20} />
        </button>
        {step === "write" && (
          <button onClick={save} className="text-primary text-[13px] tracking-wide">Save</button>
        )}
      </header>

      {step === "stopped" ? (
        <div className="px-6 mt-6">
          <h1 className="serif text-[1.5rem] text-ink leading-snug">
            The fox stopped.<br />Shall we keep this moment?
          </h1>
          <div className="mt-6">
            <FoxScene name="stopped" className="aspect-[4/5]" />
          </div>
          <button
            onClick={() => setStep("write")}
            className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-primary-foreground"
          >
            <Camera size={16} /> capture
          </button>
        </div>
      ) : (
        <div className="px-6 mt-6">
          <div className="rounded-[1.25rem] bg-paper border border-border p-3">
            <FoxScene name="meadow" className="aspect-[4/3]" />
            <p className="mt-4 text-[11px] text-sepia">Today, I felt…</p>
            <textarea
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="write a single line"
              className="w-full mt-1 bg-transparent serif text-[1.1rem] text-ink outline-none resize-none placeholder:text-sepia/50 border-b border-border pb-2"
              rows={2}
            />
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
