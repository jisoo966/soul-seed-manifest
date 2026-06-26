import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { SendHorizonal } from "lucide-react";
import { useMemo, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BackButton } from "@/components/BackButton";
import chatMock from "@/assets/mock-chat.png.asset.json";
import chatSaveMock from "@/assets/mock-chat-save.png.asset.json";
import chatContinueMock from "@/assets/mock-chat-continue.png.asset.json";

export const Route = createFileRoute("/messages")({
  validateSearch: (search: Record<string, unknown>) => ({
    saved: search.saved === true || search.saved === "true",
  }),
  head: () => ({ meta: [{ title: "Messages — sisi" }] }),
  component: Messages,
});

function Messages() {
  const { saved } = useSearch({ from: "/messages" });
  const [draft, setDraft] = useState("");
  const background = useMemo(() => {
    if (saved) return chatSaveMock.url;
    if (draft.trim()) return chatContinueMock.url;
    return chatMock.url;
  }, [draft, saved]);

  return (
    <PhoneFrame hideTabs>
      <div
        className="relative min-h-[820px] overflow-hidden"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute left-10 top-8 z-10">
          <BackButton to="/" />
        </div>

        {!saved && !draft.trim() && (
          <div className="absolute right-10 top-[30rem] z-10 flex flex-col items-end gap-3">
            <button type="button" className="rounded-[1.6rem] bg-sky px-9 py-5 serif text-[1rem] text-paper shadow-[0_18px_40px_rgba(77,93,170,0.18)]">
              Yes, save it
            </button>
            <Link
              to="/messages"
              search={{ saved: false }}
              className="rounded-[1.6rem] border-[1.5px] border-sky/85 bg-paper/35 px-9 py-5 serif text-[1rem] text-sky backdrop-blur-sm"
            >
              No thank you
            </Link>
          </div>
        )}

        {saved && (
          <div className="absolute inset-x-8 bottom-20 z-10 space-y-4">
            <button type="button" className="w-full rounded-[1.8rem] bg-lavender/60 px-8 py-5 serif text-[1.1rem] text-ink shadow-[0_18px_40px_rgba(77,93,170,0.14)] backdrop-blur-sm">
              Continue Walking
            </button>
            <button type="button" className="w-full rounded-[1.8rem] bg-paper/65 px-8 py-5 serif text-[1.1rem] text-ink shadow-[0_18px_40px_rgba(77,93,170,0.08)] backdrop-blur-sm">
              Keeep talking
            </button>
          </div>
        )}

        <div className="absolute inset-x-8 bottom-7 z-10 flex items-center gap-3 rounded-[2rem] border-[1.5px] border-white/90 bg-paper/45 px-6 py-4 backdrop-blur-md shadow-[0_18px_40px_rgba(77,93,170,0.12)]">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write here..."
            rows={1}
            className="min-h-[3rem] flex-1 resize-none bg-transparent serif text-[1.1rem] leading-snug text-ink outline-none placeholder:text-ink/35"
          />
          <button type="button" aria-label="Send message" className="grid h-14 w-14 place-items-center rounded-full bg-paper text-ink shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
            <SendHorizonal size={25} strokeWidth={2} />
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
