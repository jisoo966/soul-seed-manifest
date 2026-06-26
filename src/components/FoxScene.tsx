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

// warm, painterly gradients reminiscent of cream photo backgrounds
const palettes: Record<SceneName, string> = {
  home: "linear-gradient(165deg, oklch(0.92 0.04 95) 0%, oklch(0.85 0.07 60) 60%, oklch(0.72 0.1 35) 100%)",
  path: "linear-gradient(165deg, oklch(0.93 0.04 90) 0%, oklch(0.82 0.08 75) 100%)",
  meadow: "linear-gradient(165deg, oklch(0.92 0.05 95) 0%, oklch(0.78 0.09 85) 50%, oklch(0.65 0.1 60) 100%)",
  stopped: "linear-gradient(165deg, oklch(0.9 0.05 90) 0%, oklch(0.75 0.09 70) 100%)",
  talking: "linear-gradient(180deg, oklch(0.94 0.025 95) 0%, oklch(0.88 0.05 80) 100%)",
  "stars-night": "linear-gradient(180deg, oklch(0.22 0.05 270) 0%, oklch(0.32 0.06 280) 100%)",
  arrival: "linear-gradient(180deg, oklch(0.3 0.06 275) 0%, oklch(0.55 0.1 60) 100%)",
  splash: "linear-gradient(165deg, oklch(0.95 0.02 95) 0%, oklch(0.85 0.07 85) 100%)",
};

export function FoxScene({
  name,
  className = "",
  style,
  children,
  rounded = true,
}: {
  name: SceneName;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
  rounded?: boolean;
}) {
  const dark = name === "stars-night" || name === "arrival";
  return (
    <div
      className={`relative w-full overflow-hidden ${rounded ? "rounded-[1.5rem]" : ""} ${className}`}
      style={{ background: palettes[name], ...style }}
    >
      {/* painterly grain */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 30%, oklch(1 0 0 / 0.4), transparent 35%), radial-gradient(circle at 75% 75%, oklch(0 0 0 / 0.2), transparent 50%)",
        }}
      />
      {!dark && (
        <svg viewBox="0 0 100 100" className="absolute left-1/2 bottom-3 -translate-x-1/2 w-24 h-24 opacity-80" aria-hidden="true">
          <ellipse cx="50" cy="82" rx="18" ry="5" fill="oklch(0.3 0.05 35 / 0.3)" />
          <path
            d="M35 78 Q33 58 42 50 Q40 40 47 42 Q50 34 53 42 Q60 40 58 50 Q67 58 65 78 Z"
            fill="oklch(0.45 0.12 35)"
          />
          <path d="M40 50 L42 42 L46 48 Z M60 50 L58 42 L54 48 Z" fill="oklch(0.4 0.1 35)" />
          <circle cx="46" cy="58" r="1.2" fill="oklch(0.15 0 0)" />
          <circle cx="54" cy="58" r="1.2" fill="oklch(0.15 0 0)" />
          <path d="M48 63 Q50 65 52 63" stroke="oklch(0.15 0 0)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
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
