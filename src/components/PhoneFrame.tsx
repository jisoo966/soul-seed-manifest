import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { MapPin, Image as ImageIcon, Mail, Star } from "lucide-react";

const tabs = [
  { to: "/", label: "Journey", icon: MapPin },
  { to: "/postcards", label: "Postcards", icon: ImageIcon },
  { to: "/messages", label: "Messages", icon: Mail },
  { to: "/stars", label: "My Stars", icon: Star },
] as const;

export function PhoneFrame({ children, hideTabs = false }: { children: ReactNode; hideTabs?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh w-full flex items-stretch sm:items-center justify-center sm:py-6 sm:px-3 bg-background">
      <div
        className="relative w-full sm:max-w-[420px] bg-paper sm:rounded-[2rem] overflow-hidden flex flex-col sm:border border-border"
        style={{ minHeight: "min(900px, 100dvh)" }}
      >
        <div className="flex items-center justify-between px-6 pt-4 pb-2 text-[11px] tracking-wide text-ink/60">
          <span>9:41</span>
          <span aria-hidden="true">•••</span>
        </div>

        <div className={`flex-1 overflow-y-auto ${hideTabs ? "pb-6" : "pb-24"}`}>{children}</div>

        {!hideTabs && (
          <nav
            aria-label="Primary"
            className="absolute bottom-0 inset-x-0 px-4 py-2 flex justify-around border-t border-border bg-paper/95 backdrop-blur"
          >
            {tabs.map(({ to, label, icon: Icon }) => {
              const active = pathname === to || (to !== "/" && pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  className="flex flex-col items-center gap-1 py-1 min-h-[44px] min-w-[60px] transition"
                  style={{ color: active ? "var(--color-primary)" : "var(--color-sepia)" }}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  <span className="text-[10px] tracking-wide">{label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
