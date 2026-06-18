import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Moon } from "@/components/cosmos/Moon";
import { StarlightGrain } from "@/components/cosmos/StarlightGrain";
import { ConstellationCluster } from "@/components/cosmos/ConstellationCluster";
import { UserSilhouette } from "@/components/cosmos/UserSilhouette";
import { layoutClusters, layoutStarsInCluster, generateThreadsAroundCentroid } from "@/lib/cosmos-layout";
import { useClusters } from "@/hooks/useClusters";

type Search = { landing?: boolean; title?: string; kind?: string };

export const Route = createFileRoute("/constellations")({
  head: () => ({
    meta: [
      { title: "Sky — Sísí" },
      { name: "description", content: "What you've planted." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    landing: s.landing === true || s.landing === "true" ? true : undefined,
    title: typeof s.title === "string" ? s.title : undefined,
    kind: typeof s.kind === "string" ? s.kind : undefined,
  }),
  component: ConstellationsPage,
});

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function ConstellationsPage() {
  const { clusters, totalEntries, mostActiveId, mostActiveObservation, hasUnplantedWish } = useClusters();

  // Empty state
  if (clusters.length === 0) {
    return (
      <PhoneFrame>
        <div className="absolute inset-0 bg-[var(--background)]" />
        <StarlightGrain />
        <Moon />
        <div className="relative z-10 px-8 pt-32 text-center">
          <h1 className="text-xl serif italic mb-4" style={{ color: "var(--night-text)" }}>
            the sky is quiet.
          </h1>
          <p className="text-base serif italic mb-12 leading-relaxed" style={{ color: "var(--night-text)", opacity: 0.7 }}>
            plant a few wishes.
            <br />
            sísí will start noticing what returns.
          </p>
          <Link to="/collect" className="text-lg serif italic" style={{ color: "var(--night-gold)" }}>
            plant something ✦
          </Link>
        </div>
        <UserSilhouette hasUnplantedWish={false} />
      </PhoneFrame>
    );
  }

  const layout = layoutClusters(clusters.map((c) => c.id));

  return (
    <PhoneFrame>
      {/* night sky background */}
      <div className="absolute inset-0 bg-[var(--background)]" />

      {/* lowest layer: grain */}
      <StarlightGrain />

      {/* moon */}
      <Moon />

      {/* header */}
      <div className="relative z-10 px-6 pt-12 pb-4 text-center">
        <span
          className="cartouche inline-block text-xs serif italic mb-3"
          style={{ color: "var(--night-text)", opacity: 0.8, borderColor: "rgba(184,145,70,0.4)" }}
        >
          tonight
        </span>
        <h1 className="text-xl serif italic mb-2" style={{ color: "var(--night-text)" }}>
          what you've planted.
        </h1>
        <p className="small-caps text-[10px]" style={{ color: "var(--night-gold)", letterSpacing: "2px" }}>
          {totalEntries} WISHES · {clusters.length} GROWING INTO SHAPE
        </p>
        <div className="ornament-rule mt-3" style={{ opacity: 0.3 }} />
      </div>

      {/* constellation SVG */}
      <svg
        className="absolute inset-x-0 z-10"
        style={{ top: 180 }}
        viewBox="0 0 380 480"
        preserveAspectRatio="xMidYMid meet"
      >
        {clusters.map((c) => {
          const cl = layout[c.id];
          if (!cl) return null;
          const stars = layoutStarsInCluster(
            c.entryCount,
            { x: cl.centerX, y: cl.centerY },
            cl.radius,
            hash(c.id),
          );
          const threads = generateThreadsAroundCentroid(stars.length);
          return (
            <ConstellationCluster
              key={c.id}
              stars={stars.map((s, i) => ({ ...s, isNewest: i === stars.length - 1 }))}
              threads={threads}
              name={c.name}
              count={c.entryCount}
              metadata={c.metadata}
              state={c.id === mostActiveId ? "active" : c.state}
              labelPosition={{ x: cl.centerX, y: cl.centerY + 64 }}
            />
          );
        })}
      </svg>

      {/* user at horizon */}
      <UserSilhouette hasUnplantedWish={hasUnplantedWish} />

      {/* Sísí's observation */}
      <div className="absolute bottom-32 left-6 right-6 text-center z-10">
        <p className="text-base serif italic" style={{ color: "var(--night-text)", opacity: 0.85 }}>
          "{mostActiveObservation}"
        </p>
      </div>
    </PhoneFrame>
  );
}
