type Star = {
  x: number;
  y: number;
  size?: number;
  isNewest?: boolean;
};

type ClusterState = "active" | "forming" | "resting";

type ClusterProps = {
  stars: Star[];
  threads: Array<[number, number]>;
  name: string;
  count: number;
  metadata?: string;
  state: ClusterState;
  labelPosition: { x: number; y: number };
};

const STATE_COLORS: Record<ClusterState, { thread: string; halo: string }> = {
  active:  { thread: "var(--night-gold)",  halo: "var(--night-gold)"  },
  forming: { thread: "var(--night-olive)", halo: "var(--night-olive)" },
  resting: { thread: "var(--night-star)",  halo: "transparent"        },
};

const STATE_OPACITY: Record<ClusterState, number> = {
  active:  1,
  forming: 0.92,
  resting: 0.45,
};

function centroid(stars: Star[]) {
  const x = stars.reduce((sum, s) => sum + s.x, 0) / stars.length;
  const y = stars.reduce((sum, s) => sum + s.y, 0) / stars.length;
  return { x, y };
}

export function ConstellationCluster({
  stars,
  threads,
  name,
  count,
  metadata,
  state,
  labelPosition,
}: ClusterProps) {
  const colors = STATE_COLORS[state];
  const opacity = STATE_OPACITY[state];
  const c = centroid(stars);

  return (
    <g style={{ opacity }}>
      {/* halos for active clusters */}
      {state === "active" && (
        <>
          <circle cx={c.x} cy={c.y} r="74" fill={colors.halo} opacity="0.04" />
          <circle cx={c.x} cy={c.y} r="50" fill={colors.halo} opacity="0.05" />
        </>
      )}

      {/* threads */}
      <g
        stroke={colors.thread}
        strokeWidth={state === "active" ? 0.7 : 0.5}
        opacity="0.85"
        fill="none"
      >
        {threads.map(([a, b], i) => (
          <line
            key={i}
            x1={stars[a].x} y1={stars[a].y}
            x2={stars[b].x} y2={stars[b].y}
          />
        ))}
      </g>

      {/* stars */}
      {stars.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={s.size ?? 3.5} fill="var(--night-star)" />
          {s.isNewest && state === "active" && (
            <circle
              cx={s.x} cy={s.y} r="9"
              fill="none"
              stroke={colors.halo}
              strokeWidth="0.5"
              opacity="0.6"
            />
          )}
        </g>
      ))}

      {/* label */}
      <text
        x={labelPosition.x}
        y={labelPosition.y}
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontStyle="italic"
        fontSize={state === "active" ? 17 : 14}
        fill="var(--night-text)"
      >
        {name}
      </text>
      {metadata && (
        <text
          x={labelPosition.x}
          y={labelPosition.y + 16}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="8"
          fill={state === "active" ? "var(--night-gold)" : "var(--night-olive)"}
          letterSpacing="1.5"
        >
          {count} · {metadata.toUpperCase()}
        </text>
      )}
    </g>
  );
}
