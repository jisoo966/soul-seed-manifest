const GRAIN_POSITIONS = [
  { cx: 38,  cy: 156, r: 0.6 },
  { cx: 124, cy: 118, r: 0.6 },
  { cx: 58,  cy: 232, r: 0.5 },
  { cx: 328, cy: 268, r: 0.5 },
  { cx: 20,  cy: 346, r: 0.4 },
  { cx: 358, cy: 386, r: 0.4 },
  { cx: 232, cy: 170, r: 0.4 },
  { cx: 98,  cy: 426, r: 0.5 },
  { cx: 304, cy: 486, r: 0.4 },
  { cx: 160, cy: 510, r: 0.4 },
  { cx: 36,  cy: 588, r: 0.5 },
  { cx: 346, cy: 610, r: 0.4 },
  { cx: 78,  cy: 138, r: 0.4 },
  { cx: 262, cy: 216, r: 0.4 },
  { cx: 200, cy: 60,  r: 0.4 },
];

export function StarlightGrain() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 380 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="var(--night-star)" opacity="0.45">
        {GRAIN_POSITIONS.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} />
        ))}
      </g>
    </svg>
  );
}
