import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

const tabs = [
  { to: "/", label: "Today" },
  { to: "/collect", label: "Entries" },
  { to: "/correspondence", label: "Letters" },
  { to: "/constellations", label: "Patterns" },
] as const;

export function PhoneFrame({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isDark = pathname === "/constellations";

  return (
    <div className={`min-h-screen w-full flex items-center justify-center py-6 px-3 ${isDark ? "dark bg-background" : "bg-background"}`}>
      <div
        className="relative w-full max-w-[420px] bg-paper rounded-[2rem] overflow-hidden flex flex-col border border-border"
        style={{
          minHeight: "min(900px, 95vh)",
        }}
      >
        {/* status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 text-[11px] tracking-wide text-ink/60">
          <span>9:41</span>
          <span>•••</span>
        </div>

        {/* content scroll area */}
        <div className="flex-1 overflow-y-auto px-6 pb-24">{children}</div>

        {/* tab bar */}
        <nav className="absolute bottom-0 inset-x-0 px-6 py-3 flex justify-between border-t border-border bg-paper">
          {tabs.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="py-1 transition-opacity text-[11px] tracking-[0.18em] uppercase"
                style={{ opacity: active ? 1 : 0.4, color: "var(--color-ink)" }}
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
