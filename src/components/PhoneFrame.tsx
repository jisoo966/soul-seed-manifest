import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Mail, Sparkles } from "lucide-react";
import { dottedIconProps } from "./DottedGlyph";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/collect", label: "Collect", icon: BookOpen },
  { to: "/correspondence", label: "Correspondence", icon: Mail },
  { to: "/constellations", label: "Constellations", icon: Sparkles },
] as const;

export function PhoneFrame({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center py-6 px-3">
      <div
        className="relative w-full max-w-[420px] bg-paper rounded-[2.5rem] overflow-hidden flex flex-col"
        style={{
          minHeight: "min(900px, 95vh)",
          boxShadow:
            "0 30px 80px -30px oklch(0.3 0.05 60 / 0.35), 0 0 0 1px oklch(0.85 0.02 75)",
        }}
      >
        {/* status bar */}
        <div className="flex items-center justify-between px-7 pt-5 pb-2 text-[11px] font-medium tracking-wide text-ink/70">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span>•••</span>
            <span>◐</span>
            <span>▮</span>
          </span>
        </div>

        {/* content scroll area */}
        <div className="flex-1 overflow-y-auto px-5 pb-24">{children}</div>

        {/* tab bar */}
        <nav
          className="absolute bottom-0 inset-x-0 px-2 py-3 flex justify-around border-t border-border/70"
          style={{ backgroundColor: "oklch(0.96 0.013 88 / 0.92)", backdropFilter: "blur(8px)" }}
        >
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center gap-1 py-1 px-3 transition-opacity"
                style={{ opacity: active ? 1 : 0.55 }}
              >
                <Icon className="h-[20px] w-[20px]" {...dottedIconProps} />
                <span className="text-[10px] tracking-wide serif italic">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
