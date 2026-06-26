import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Star } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { FoxScene } from "@/components/FoxScene";

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
    <PhoneFrame>
      <header className="px-6 pt-4 flex items-center justify-between">
        <Link to="/stars" className="text-ink"><ArrowLeft size={20} /></Link>
        <span className="text-sepia text-[18px]">…</span>
      </header>

      <div className="px-6 mt-4">
        <h1 className="serif text-[1.6rem] text-ink inline-flex items-center gap-2">
          <Star size={18} className="text-mustard" fill="currentColor" /> {label}
        </h1>
      </div>

      <dl className="px-6 mt-6 space-y-3 text-[13px]">
        {[
          ["First noticed", "Apr 5, 2024"],
          ["Mentioned", "23 times"],
          ["Recent sign", "Yesterday"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-border pb-2">
            <dt className="text-sepia tracking-wide uppercase text-[10px] self-center">{k}</dt>
            <dd className="serif text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="px-6 mt-8">
        <p className="small-caps mb-3">Related postcards</p>
        <div className="grid grid-cols-3 gap-3">
          <FoxScene name="meadow" className="aspect-[3/4]" />
          <FoxScene name="path" className="aspect-[3/4]" />
          <FoxScene name="home" className="aspect-[3/4]" />
        </div>
        <button className="mt-4 w-full py-3 rounded-full bg-accent text-ink text-[12px] tracking-wide">
          View all
        </button>
      </section>

      <section className="px-6 mt-8">
        <p className="small-caps mb-3">Journey to this star</p>
        <FoxScene name="arrival" className="aspect-[4/3]">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="serif text-paper text-[1.05rem] text-center px-6">
              You've come a long way.<br />Keep going.
            </p>
          </div>
        </FoxScene>
      </section>
    </PhoneFrame>
  );
}
