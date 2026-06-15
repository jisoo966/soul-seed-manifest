import type { CSSProperties } from "react";

type Variant = "star" | "moon" | "flower" | "fleuron" | "spark" | "seed";

const DOT_STROKE = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeDasharray: "0.1 2.1",
};

export function DottedGlyph({
  variant,
  size = 20,
  className,
  style,
  filled = false,
}: {
  variant: Variant;
  size?: number;
  className?: string;
  style?: CSSProperties;
  filled?: boolean;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    className,
    style,
    ...DOT_STROKE,
    // tighten dots a bit when small
    strokeDasharray: size <= 14 ? "0.1 1.6" : "0.1 2.1",
  };

  switch (variant) {
    case "star":
      return (
        <svg {...common}>
          <path d="M12 2 L13.6 10.4 L22 12 L13.6 13.6 L12 22 L10.4 13.6 L2 12 L10.4 10.4 Z" />
          {filled && (
            <circle cx="12" cy="12" r="0.7" fill="currentColor" stroke="none" />
          )}
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 4 L13 11 L20 12 L13 13 L12 20 L11 13 L4 12 L11 11 Z" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M20 14.5 A8.5 8.5 0 1 1 13 4.2 A6.5 6.5 0 1 0 20 14.5 Z" />
        </svg>
      );
    case "flower":
      return (
        <svg {...common}>
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse
              key={a}
              cx="12"
              cy="6"
              rx="2.4"
              ry="4"
              transform={`rotate(${a} 12 12)`}
            />
          ))}
          <circle cx="12" cy="12" r="1.8" />
        </svg>
      );
    case "fleuron":
      // ornamental ❦-like fleuron
      return (
        <svg {...common}>
          <path d="M12 3 C8 7.5 3.5 10 3.5 12 C3.5 14 8 16.5 12 21 C16 16.5 20.5 14 20.5 12 C20.5 10 16 7.5 12 3 Z" />
          <path d="M12 3 L12 21" />
        </svg>
      );
    case "seed":
      // tiny cross-spark
      return (
        <svg {...common} strokeDasharray="0.1 1.4">
          <path d="M12 6 L12 18 M6 12 L18 12" />
        </svg>
      );
  }
}

// Apply this to any lucide icon to give it a dotted-outline look:
//   <Home {...dottedIconProps} />
export const dottedIconProps = {
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeDasharray: "0.1 2.2",
};
