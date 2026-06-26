import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, X } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { FoxScene } from "@/components/FoxScene";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Messages — sisi" }] }),
  component: Messages,
});

const inbox = [
  {
    id: "m1",
    preview: "You've walked a long way.",
    body: "You've walked\na long way.\n\nTrust the path\nyou're on.",
    date: "today",
    unread: true,
  },
  {
    id: "m2",
    preview: "Some things arrive slowly.",
    body: "Some things arrive slowly.\nThat's not late — that's their pace.",
    date: "yesterday",
    unread: false,
  },
  {
    id: "m3",
    preview: "You haven't mentioned your painting.",
    body: "You haven't mentioned your painting\nrecently. How is it?",
    date: "Jun 20",
    unread: false,
  },
];

function Messages() {
  const [open, setOpen] = useState<string | null>(null);
  const msg = inbox.find((m) => m.id === open);

  return (
    <PhoneFrame>
      <header className="px-6 pt-4">
        <h1 className="serif text-[1.5rem] text-ink">Messages</h1>
        <p className="mt-1 text-[11px] text-sepia">little notes from your companion</p>
      </header>

      <ul className="mt-6 px-6 space-y-3">
        {inbox.map((m) => (
          <li key={m.id}>
            <button
              onClick={() => setOpen(m.id)}
              className="w-full text-left flex items-start gap-3 rounded-[1rem] border border-border bg-paper p-4 hover:border-primary/40 transition"
            >
              <span className="mt-1 h-9 w-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Mail size={16} className="text-primary" />
                {m.unread && (
                  <span className="absolute mt-[-22px] ml-6 h-2 w-2 rounded-full bg-primary" />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className="serif text-[1rem] text-ink truncate">{m.preview}</p>
                <p className="mt-0.5 text-[11px] text-sepia">{m.date}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {msg && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center p-6"
          style={{ background: "oklch(0.3 0.05 280 / 0.7)" }}
        >
          <FoxScene name="stars-night" className="absolute inset-0 rounded-none" />
          <div className="relative w-full max-w-[300px] rounded-[1.25rem] bg-paper p-8 text-center shadow-2xl">
            <span className="mx-auto mb-4 h-10 w-10 rounded-full bg-accent flex items-center justify-center">
              <Mail size={18} className="text-primary" />
            </span>
            <p className="serif text-[1.2rem] text-ink leading-snug whitespace-pre-line">
              {msg.body}
            </p>
            <p className="mt-4 text-[11px] text-sepia">{msg.date}</p>
          </div>
          <button
            onClick={() => setOpen(null)}
            aria-label="Close"
            className="absolute bottom-10 h-10 w-10 rounded-full bg-paper/90 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </PhoneFrame>
  );
}
