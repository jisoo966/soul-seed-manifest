import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Heart, Brush, Sparkles, Sun, Star } from "lucide-react";
import { FoxScene } from "@/components/FoxScene";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — sisi" }] }),
  component: Onboarding,
});

type StepKey = "splash" | "hoping" | "confirm" | "name";

const hopes = [
  { key: "home", label: "To feel at home", Icon: Home },
  { key: "trust", label: "To trust myself", Icon: Heart },
  { key: "create", label: "To create more", Icon: Brush },
  { key: "love", label: "To feel loved", Icon: Sparkles },
  { key: "else", label: "Something else", Icon: Sun },
];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<StepKey>("splash");
  const [hope, setHope] = useState<string>("");
  const [name, setName] = useState("");

  const finish = () => {
    if (typeof window !== "undefined") {
      if (name.trim()) window.localStorage.setItem("sisi:name", name.trim());
      const selected = hopes.find((h) => h.key === hope)?.label;
      if (selected) window.localStorage.setItem("sisi:primaryStar", selected);
      window.localStorage.setItem("sisi:onboarded", "1");
    }
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-dvh w-full flex items-stretch sm:items-center justify-center sm:py-6 sm:px-3 bg-background">
      <div
        className="relative w-full sm:max-w-[420px] bg-paper sm:rounded-[2rem] overflow-hidden flex flex-col sm:border border-border"
        style={{ minHeight: "min(900px, 100dvh)" }}
      >
        <div className="flex items-center justify-between px-6 pt-4 pb-2 text-[11px] tracking-wide text-ink/60">
          <span>9:41</span>
          <button onClick={finish} className="text-sepia uppercase tracking-[0.2em] text-[11px]">
            Skip
          </button>
        </div>

        <div className="flex-1 flex flex-col px-8 pt-8 pb-10">
          {step === "splash" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <p className="serif italic text-primary text-[1.5rem] tracking-[0.4em]">s i s i</p>
              <div className="mt-10 w-44">
                <FoxScene name="splash" className="aspect-square" />
              </div>
              <p className="mt-10 serif text-[0.95rem] text-sepia leading-relaxed">
                a journey<br />with your<br />inner companion
              </p>
            </div>
          )}

          {step === "hoping" && (
            <div className="flex-1 flex flex-col">
              <div className="rounded-2xl bg-accent px-4 py-3 self-start max-w-[78%]">
                <p className="serif text-[1rem] text-ink leading-snug">
                  Before we start,<br />what are you hoping for?
                </p>
              </div>
              <div className="mt-6 w-32 self-center">
                <FoxScene name="splash" className="aspect-square" />
              </div>
              <ul className="mt-6 space-y-2">
                {hopes.map(({ key, label, Icon }) => (
                  <li key={key}>
                    <button
                      onClick={() => setHope(key)}
                      className={`w-full flex items-center gap-3 rounded-full border px-4 py-3 transition text-left ${
                        hope === key ? "border-primary bg-accent" : "border-border bg-paper"
                      }`}
                    >
                      <Icon size={16} className={hope === key ? "text-primary" : "text-sepia"} />
                      <span className="serif text-[0.95rem] text-ink flex-1">{label}</span>
                      <Star
                        size={14}
                        className={hope === key ? "text-mustard" : "text-border"}
                        fill={hope === key ? "currentColor" : "none"}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === "confirm" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="rounded-2xl bg-accent px-4 py-3 max-w-[78%]">
                <p className="serif text-[1rem] text-ink">Let's follow that one.</p>
              </div>
              <div className="mt-8 w-44">
                <FoxScene name="splash" className="aspect-square">
                  <Star
                    size={20}
                    className="absolute top-6 right-8 text-mustard"
                    fill="currentColor"
                  />
                </FoxScene>
              </div>
              <p className="mt-6 serif text-[1.05rem] text-ink">
                {hopes.find((h) => h.key === hope)?.label}
              </p>
            </div>
          )}

          {step === "name" && (
            <div className="flex-1 flex flex-col">
              <p className="small-caps">One last thing</p>
              <h1 className="mt-6 serif text-[1.9rem] leading-[1.15] text-ink">
                How should I<br />call you?
              </h1>
              <form
                onSubmit={(e) => { e.preventDefault(); finish(); }}
                className="mt-10"
              >
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-transparent outline-none serif text-[1.4rem] text-ink placeholder:text-sepia/40 border-b border-border py-2 focus:border-primary transition-colors"
                />
                <p className="mt-3 text-[11px] text-sepia">You can change this later.</p>
              </form>
            </div>
          )}

          <div className="mt-auto pt-8">
            <button
              onClick={() => {
                if (step === "splash") setStep("hoping");
                else if (step === "hoping") { if (hope) setStep("confirm"); }
                else if (step === "confirm") setStep("name");
                else finish();
              }}
              disabled={(step === "hoping" && !hope) || (step === "name" && !name.trim())}
              className="w-full block text-center py-4 rounded-full bg-primary text-primary-foreground serif text-[14px] tracking-[0.05em] hover:opacity-90 transition disabled:opacity-30"
            >
              {step === "splash" && "Begin"}
              {step === "hoping" && "Continue"}
              {step === "confirm" && "Start our journey"}
              {step === "name" && "Enter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
