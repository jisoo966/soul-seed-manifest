import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Sísí" },
      { name: "description", content: "Your archive." },
    ],
  }),
  component: Profile,
});

function SettingsRow({
  label,
  value,
  highlight = false,
  onClick,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3.5 flex items-center justify-between text-left min-h-[44px] border-b transition-opacity hover:opacity-60"
      style={{ borderColor: "var(--color-border)" }}
    >
      <span className="text-[13px] serif text-ink">{label}</span>
      <span
        className="text-[12px] serif italic"
        style={{ color: highlight ? "var(--color-oxblood)" : "var(--color-muted-foreground)" }}
      >
        {value}
      </span>
    </button>
  );
}

function Profile() {
  const [name, setName] = useState("—");
  const [joinedAt, setJoinedAt] = useState<string | null>(null);
  const [archiveType, setArchiveType] = useState<string | null>(null);
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const n = window.localStorage.getItem("sisi:name");
    if (n) setName(n);

    const joined = window.localStorage.getItem("sisi:joined");
    if (!joined) {
      const now = new Date().toISOString();
      window.localStorage.setItem("sisi:joined", now);
      setJoinedAt(now);
    } else {
      setJoinedAt(joined);
    }

    const at = window.localStorage.getItem("sisi:archiveType");
    if (at) setArchiveType(at);

    const entries = JSON.parse(window.localStorage.getItem("sisi:entries") || "[]");
    setEntryCount(entries.length);
  }, []);

  const joinedFormatted = joinedAt
    ? new Date(joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }).toLowerCase()
    : "—";

  return (
    <PhoneFrame>
      <Link to="/" className="block text-xs small-caps mt-6 mb-8" style={{ color: "var(--color-muted-foreground)" }}>
        ‹ home
      </Link>

      {/* Bookplate */}
      <div className="paper-card relative px-8 py-10 mb-10">
        <p
          className="small-caps text-[10px] text-center mb-3"
          style={{ letterSpacing: "3px", color: "var(--color-ink)", opacity: 0.7 }}
        >
          — EX LIBRIS —
        </p>
        <div className="w-12 h-px mx-auto mb-6" style={{ background: "var(--color-gold)" }} />

        <p className="text-3xl serif italic text-ink text-center mb-6">{name}</p>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="small-caps text-[9px] mb-1" style={{ color: "var(--color-muted-foreground)" }}>
              MEMBER SINCE
            </p>
            <p className="serif text-ink">{joinedFormatted}</p>
          </div>
          <div>
            <p className="small-caps text-[9px] mb-1" style={{ color: "var(--color-muted-foreground)" }}>
              ARCHIVE TYPE
            </p>
            <p className="serif italic text-ink">{archiveType ?? "unset"}</p>
          </div>
          <div>
            <p className="small-caps text-[9px] mb-1" style={{ color: "var(--color-muted-foreground)" }}>
              ENTRIES PLANTED
            </p>
            <p className="serif text-ink">{entryCount}</p>
          </div>
        </div>

        {/* Wax seal S */}
        <div className="absolute bottom-4 right-4">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "var(--color-oxblood)" }}
          >
            <span className="serif italic text-sm" style={{ color: "var(--color-paper)" }}>S</span>
          </div>
        </div>
      </div>

      {/* Settings rows */}
      <div className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <SettingsRow label="archive type"    value={archiveType ?? "unset ›"} />
        <SettingsRow label="soft reminders"  value="on ›" />
        <SettingsRow label="sísí's voice"    value="soft ›" />
        <SettingsRow label="membership"      value="trial · 03 days ›" highlight />
        <SettingsRow label="export your archive" value="PDF ›" />
        <SettingsRow label="draw your sigil" value="optional ›" />
      </div>
    </PhoneFrame>
  );
}
