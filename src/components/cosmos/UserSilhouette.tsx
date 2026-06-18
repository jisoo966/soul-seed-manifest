type UserSilhouetteProps = {
  hasUnplantedWish?: boolean;
};

export function UserSilhouette({ hasUnplantedWish = false }: UserSilhouetteProps) {
  return (
    <svg
      viewBox="0 0 380 200"
      className="absolute bottom-32 left-0 right-0 w-full h-48 pointer-events-none"
      preserveAspectRatio="xMidYEnd meet"
    >
      {/* horizon hill */}
      <path
        d="M -10 120 Q 190 80 390 120 L 390 200 L -10 200 Z"
        fill="#1A2238"
        opacity="0.95"
      />
      <path
        d="M -10 120 Q 190 80 390 120"
        stroke="var(--night-olive)"
        strokeWidth="0.4"
        fill="none"
        opacity="0.5"
      />

      {/* small grass tufts */}
      <g stroke="var(--night-olive)" strokeWidth="0.4" fill="none" opacity="0.45">
        <line x1="40"  y1="118" x2="42"  y2="110" />
        <line x1="68"  y1="110" x2="70"  y2="102" />
        <line x1="98"  y1="108" x2="100" y2="100" />
        <line x1="260" y1="108" x2="262" y2="100" />
        <line x1="296" y1="110" x2="298" y2="102" />
        <line x1="340" y1="116" x2="342" y2="108" />
      </g>

      {/* the user — sitting silhouette */}
      <g transform="translate(190, 96)">
        {/* lap */}
        <ellipse cx="0" cy="14" rx="14" ry="4" fill="var(--night-sky)" />
        {/* torso */}
        <path d="M -8 14 q 0 -22 8 -22 q 8 0 8 22 Z" fill="var(--night-sky)" />
        {/* head */}
        <circle cx="0" cy="-12" r="5" fill="var(--night-sky)" />

        {/* wish in lap + dotted trail rising */}
        {hasUnplantedWish && (
          <>
            <circle cx="0" cy="6" r="1.6" fill="var(--night-gold)" />
            <line
              x1="0" y1="4" x2="0" y2="-30"
              stroke="var(--night-gold)" strokeWidth="0.4"
              strokeDasharray="1 3" opacity="0.55"
            />
            <line
              x1="0" y1="-30" x2="-4" y2="-60"
              stroke="var(--night-gold)" strokeWidth="0.4"
              strokeDasharray="1 3" opacity="0.55"
            />
          </>
        )}
      </g>
    </svg>
  );
}
