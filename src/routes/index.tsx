import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

type Period = "week" | "month" | "year";
type Wish = { id: string; title: string; period: Period };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sisi — a quiet daily journal" },
      { name: "description", content: "One small entry a day. A quiet daily journal." },
      { property: "og:title", content: "Sisi — a quiet daily journal" },
      { property: "og:description", content: "One small entry a day." },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [quick, setQuick] = useState("");
  const [name, setName] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("sisi:name") || "";
  });


  // First-time visitors → onboarding (once per browser)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem("sisi:onboarded")) {
      navigate({ to: "/onboarding", replace: true });
    }
  }, [navigate]);

  const addWish = (title: string) => {
    const t = title.trim();
    if (!t) return;
    setWishes((w) => [{ id: String(Date.now()), title: t, period: "year" }, ...w]);
  };

  return (
    <PhoneFrame>
      <header className="pt-6 relative">
        <p className="small-caps">Monday / June 15 / 2026</p>

        <div className="mt-6">
          <h1 className="serif text-[2.5rem] leading-[1.1] text-ink">
            hello
            {name ? (
              <>, <span className="text-sepia">{name}</span></>
            ) : null}
          </h1>
        </div>

        <Link
          to="/profile"
          aria-label="Profile"
          className="absolute top-6 right-6 h-9 w-9 rounded-full border border-border flex items-center justify-center serif text-[13px] text-ink hover:bg-muted transition"
        >
          {name ? name.charAt(0).toUpperCase() : "J"}
        </Link>
      </header>


      <div className="mt-8 ink-divider" />

      {/* Today's prompt */}
      <section className="mt-8">
        <p className="small-caps mb-3">Today's prompt</p>
        <p className="serif text-[1.35rem] leading-[1.35] text-ink">
          What is one thing that stayed with you from yesterday?
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addWish(quick);
            setQuick("");
          }}
          className="mt-6"
        >
          <input
            value={quick}
            onChange={(e) => setQuick(e.target.value)}
            placeholder="Write a single line…"
            className="w-full bg-transparent outline-none serif text-[15px] text-ink placeholder:text-sepia/60 border-b border-border py-2 focus:border-ink transition-colors"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={!quick.trim()}
              className="text-[11px] tracking-[0.22em] uppercase text-ink disabled:opacity-30 transition"
            >
              Save →
            </button>
          </div>
        </form>

        {wishes.length > 0 && (
          <ul className="mt-2 space-y-2">
            {wishes.slice(0, 3).map((w) => (
              <li key={w.id} className="flex items-baseline gap-3 text-[14px] serif text-ink">
                <span className="text-sepia text-[10px]">—</span>
                <span className="flex-1 truncate">{w.title}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10 ink-divider" />

      {/* Primary action */}
      <Link
        to="/collect"
        className="mt-8 block text-center py-4 border border-ink text-ink serif text-[14px] tracking-[0.05em] hover:bg-ink hover:text-paper transition rounded-md"
      >
        Write today's entry
      </Link>

      {/* Yesterday */}
      <section className="mt-10">
        <p className="small-caps mb-3">Yesterday</p>
        <blockquote className="serif text-[1.1rem] leading-[1.45] text-ink">
          "You said you wanted to feel chosen."
        </blockquote>
        <p className="mt-2 text-[11px] text-sepia">June 14, 2026</p>
      </section>

      <div className="mt-8 ink-divider" />

      {/* Today's message */}
      <Link to="/collect" className="mt-8 block group">
        <p className="small-caps mb-3">A message arrived</p>
        <p className="serif text-[1.1rem] leading-[1.45] text-ink group-hover:opacity-70 transition">
          "Some things arrive slowly."
        </p>
      </Link>

      <div className="mt-8 ink-divider" />

      <Link to="/correspondence" className="mt-8 block group">
        <p className="small-caps mb-3">Quiet reminder</p>
        <p className="serif text-[1.05rem] leading-[1.45] text-ink group-hover:opacity-70 transition">
          You haven't mentioned your painting recently. How is it?
        </p>
      </Link>

      <div className="mt-8 ink-divider" />

      <Link to="/constellations" className="mt-8 block group">
        <p className="small-caps mb-3">Recent pattern</p>
        <p className="serif text-[1.05rem] leading-[1.45] text-ink group-hover:opacity-70 transition">
          You've been thinking about <em>relationship</em> a lot lately.
          <span className="text-sepia text-[12px] ml-2 not-italic">4 entries</span>
        </p>
      </Link>

      <footer className="mt-16 mb-4 text-center">
        <p className="text-[11px] text-sepia tracking-wide">
          little by little, day by day.
        </p>
      </footer>
    </PhoneFrame>
  );
}
