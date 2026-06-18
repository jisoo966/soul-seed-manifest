type MoonProps = {
  className?: string;
};

export function Moon({ className = "" }: MoonProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`absolute top-12 right-6 w-20 h-20 ${className}`}
      aria-label="sísí"
    >
      {/* soft halos */}
      <circle cx="60" cy="60" r="56" fill="var(--night-star)" opacity="0.025" />
      <circle cx="60" cy="60" r="46" fill="var(--night-star)" opacity="0.04" />

      {/* moon body */}
      <circle cx="60" cy="60" r="32" fill="var(--night-star)" opacity="0.97" />

      {/* craters */}
      <circle cx="52" cy="50" r="3"   fill="var(--night-sky)" opacity="0.13" />
      <circle cx="66" cy="66" r="2.5" fill="var(--night-sky)" opacity="0.12" />
      <circle cx="48" cy="68" r="1.8" fill="var(--night-sky)" opacity="0.12" />
      <circle cx="70" cy="54" r="1.5" fill="var(--night-sky)" opacity="0.1"  />

      {/* tiny italic s — Sísí's signature */}
      <text
        x="60"
        y="65"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontStyle="italic"
        fontSize="14"
        fill="var(--night-sky)"
        opacity="0.45"
      >
        s
      </text>
    </svg>
  );
}
