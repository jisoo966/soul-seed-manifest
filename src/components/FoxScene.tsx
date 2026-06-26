import type { CSSProperties } from "react";

type SceneName =
  | "home"
  | "path"
  | "meadow"
  | "stopped"
  | "talking"
  | "stars-night"
  | "arrival"
  | "splash";

const palettes: Record<SceneName, string> = {
  home: "linear-gradient(180deg, oklch(0.94 0.025 280) 0%, oklch(0.93 0.03 100) 55%, oklch(0.9 0.04 90) 100%)",
  path: "linear-gradient(180deg, oklch(0.93 0.03 280) 0%, oklch(0.94 0.025 100) 100%)",
  meadow: "linear-gradient(180deg, oklch(0.93 0.025 270) 0%, oklch(0.94 0.04 95) 60%, oklch(0.88 0.06 90) 100%)",
  stopped: "linear-gradient(180deg, oklch(0.92 0.03 280) 0%, oklch(0.93 0.035 90) 100%)",
  talking: "linear-gradient(180deg, oklch(0.95 0.018 280) 0%, oklch(0.96 0.012 90) 100%)",
  "stars-night": "linear-gradient(180deg, oklch(0.22 0.05 270) 0%, oklch(0.32 0.06 280) 100%)",
  arrival: "linear-gradient(180deg, oklch(0.28 0.06 275) 0%, oklch(0.45 0.08 60) 100%)",
  splash: "linear-gradient(180deg, oklch(0.97 0.015 90) 0%, oklch(0.94 0.025 280) 100%)",
};

export function FoxScene({
  name,
  className = "",
  style,
  children,
}: {
  name: SceneName;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}) {
  const dark = name === "stars-night" || name === "arrival";
  return (
    <div
      className={`relative w-full overflow-hidden rounded-[1.25rem] ${className}`}
      style={{ background: palettes[name], ...style }}
    >
      {/* subtle watercolor flecks */}
      <div className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none"
           style={{
             backgroundImage: dark
               ? "radial-gradient(1px 1px at 20% 30%, white 50%, transparent 51%), radial-gradient(1px 1px at 70% 20%, white 50%, transparent 51%), radial-gradient(1px 1px at 40% 70%, white 50%, transparent 51%), radial-gradient(1px 1px at 85% 60%, white 50%, transparent 51%)"
               : "radial-gradient(circle at 30% 70%, oklch(0.7 0.05 145 / 0.18), transparent 40%), radial-gradient(circle at 70% 40%, oklch(0.7 0.08 280 / 0.15), transparent 40%)",
           }}
      />
      {/* fox silhouette placeholder (will be replaced by uploaded image) */}
      {!dark && (
        <svg
          viewBox="0 0 100 100"
          className="absolute left-1/2 bottom-4 -translate-x-1/2 w-20 h-20 opacity-80"
          aria-hidden="true"
        >
          <ellipse cx="50" cy="78" rx="18" ry="6" fill="oklch(0.5 0.08 280 / 0.3)" />
          <path
            d="M35 75 Q33 55 42 48 Q40 38 47 40 Q50 32 53 40 Q60 38 58 48 Q67 55 65 75 Z"
            fill="oklch(0.55 0.09 275)"
          />
          <circle cx="46" cy="55" r="1.2" fill="oklch(0.18 0 0)" />
          <circle cx="54" cy="55" r="1.2" fill="oklch(0.18 0 0)" />
        </svg>
      )}
      {dark && (
        <>
          <div className="absolute top-6 left-8 text-mustard text-xl">☾</div>
          <div className="absolute top-10 right-12 text-mustard text-sm">✦</div>
          <div className="absolute top-20 left-1/2 text-mustard text-base">✦</div>
        </>
      )}
      {children}
    </div>
  );
}
