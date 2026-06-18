import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

const tabs = [
  { to: "/", label: "Today" },
  { to: "/collect", label: "Entries" },
  { to: "/correspondence", label: "Letters" },
  { to: "/constellations", label: "Patterns" },
] as const;

export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isNight = pathname === "/constellations";

  return (
    <div
      className={`min-h-dvh w-full flex items-stretch sm:items-center justify-center sm:py-6 sm:px-3 ${
        isNight ? "night bg-background" : "bg-background"
      } ${className ?? ""}`}
    >
      <div
        className="relative w-full sm:max-w-[420px] bg-paper sm:rounded-[2rem] overflow-hidden flex flex-col sm:border border-border"
        style={{
          minHeight: "min(900px, 100dvh)",
        }}
      >
        {/* status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 text-[11px] tracking-wide text-ink/60">
          <span>9:41</span>
          <span aria-hidden="true">•••</span>
        </div>

        {/* content scroll area */}
        <div className="flex-1 overflow-y-auto px-6 pb-24">{children}</div>

        {/* tab bar */}
        <nav
          aria-label="Primary"
          className={`absolute bottom-0 inset-x-0 px-6 py-3 flex justify-between border-t ${
            isNight ? "border-white/10 bg-[#0B0F1F]" : "border-border bg-paper"
          }`}
        >
          {tabs.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="py-1 transition-opacity text-[11px] tracking-[0.18em] uppercase min-h-[44px] flex items-center"
                style={{
                  opacity: active ? 1 : isNight ? 0.6 : 0.5,
                  color: isNight ? "var(--color-night-text)" : "var(--color-ink)",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
