import type { CSSProperties } from "react";
import sceneHill from "../assets/scene-hill.png.asset.json";
import scenePath from "../assets/scene-path.png.asset.json";
import sceneFox from "../assets/scene-fox.png.asset.json";
import sceneWalking from "../assets/scene-walking.png.asset.json";
import sceneSky from "../assets/scene-sky.png.asset.json";

type SceneName =
  | "home"
  | "path"
  | "meadow"
  | "stopped"
  | "talking"
  | "stars-night"
  | "arrival"
  | "splash";

// Map each scene name to one of the uploaded mockup illustrations.
const sceneImages: Record<SceneName, string> = {
  home: sceneHill.url,
  path: scenePath.url,
  meadow: sceneWalking.url,
  stopped: sceneFox.url,
  talking: sceneSky.url,
  "stars-night": sceneSky.url,
  arrival: sceneWalking.url,
  splash: sceneHill.url,
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
  return (
    <div
      className={`relative w-full overflow-hidden ${rounded ? "rounded-[1.5rem]" : ""} ${className}`}
      style={{
        backgroundImage: `url(${sceneImages[name]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "oklch(0.92 0.04 95)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
