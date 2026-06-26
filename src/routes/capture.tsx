import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Camera, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BackButton } from "@/components/BackButton";
import journalMock from "@/assets/mock-journal.png.asset.json";

export const Route = createFileRoute("/capture")({
  head: () => ({ meta: [{ title: "Capture — sisi" }] }),
  component: Capture,
});

const prompts = ["I felt grateful", "Something surprised me", "something is on my mind"];

function Capture() {
  const navigate = useNavigate();
  const [note, setNote] = useState("");

  const save = () => {
    if (typeof window !== "undefined" && note.trim()) {
      window.localStorage.setItem("sisi:todayFeeling", note.trim());
    }
    navigate({ to: "/messages" });
  };

  return (
    <PhoneFrame hideTabs>
      <div
        className="relative min-h-[820px] overflow-hidden"
        style={{
          backgroundImage: `url(${journalMock.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute left-10 top-8 z-10">
          <BackButton to="/" />
        </div>

        <div className="px-10 pt-30 pb-10">
          <div className="rounded-[2rem] border-[1.5px] border-white/90 bg-paper/80 px-8 py-10 text-center shadow-[0_18px_40px_rgba(77,93,170,0.08)] backdrop-blur-sm">
            <h1 className="serif text-[2.2rem] leading-[1.2] text-ink">What stayed with<br />you today?</h1>
          </div>

          <div className="mt-[25rem] grid grid-cols-3 gap-3">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setNote(prompt)}
                className="min-h-[7.6rem] rounded-[1.35rem] border-[1.5px] border-sky/85 bg-paper/25 px-4 py-5 text-left serif text-[1rem] leading-[1.3] text-sky backdrop-blur-[1px]"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-[2rem] border-[1.5px] border-white/90 bg-paper/72 px-6 py-4 shadow-[0_18px_40px_rgba(77,93,170,0.08)] backdrop-blur-sm">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write here..."
              rows={1}
              className="min-h-[3rem] flex-1 resize-none bg-transparent serif text-[1.1rem] leading-snug text-ink outline-none placeholder:text-ink/35"
            />
            <button
              type="button"
              onClick={save}
              aria-label="Send note"
              className="grid h-14 w-14 place-items-center rounded-full bg-paper text-ink shadow-[0_10px_24px_rgba(0,0,0,0.06)]"
            >
              <SendHorizonal size={25} strokeWidth={2} />
            </button>
          </div>

          <Link
            to="/postcards"
            aria-label="Open camera flow"
            className="sr-only"
          >
            <Camera />
          </Link>
        </div>
      </div>
    </PhoneFrame>
  );
}
