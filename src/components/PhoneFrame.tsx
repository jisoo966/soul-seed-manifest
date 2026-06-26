import type { ReactNode } from "react";

export function PhoneFrame({ children, hideTabs = false }: { children: ReactNode; hideTabs?: boolean }) {
  return (
    <div className="min-h-dvh w-full flex items-stretch sm:items-center justify-center bg-background sm:py-6 sm:px-3">
      <div
        className="relative w-full sm:max-w-[420px] overflow-hidden bg-paper sm:rounded-[2rem] sm:border border-border"
        style={{ minHeight: "min(900px, 100dvh)" }}
      >
        <div className={`relative min-h-dvh ${hideTabs ? "" : "pb-0"}`}>{children}</div>
      </div>
    </div>
  );
}
