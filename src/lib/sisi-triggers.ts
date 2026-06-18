type Entry = { id: number; text: string; type: string | null; createdAt: string };

type Reminder = {
  id: string;
  sisiLine: string;
  action: { type: string; suggested?: string; tag?: string };
};

export function getSoftReminders({
  entries,
  daysSinceJoin,
  archiveType,
  hasWrittenFutureLetter,
}: {
  entries: Entry[];
  daysSinceJoin: number;
  archiveType: string | null;
  hasWrittenFutureLetter: boolean;
}): Reminder[] {
  const reminders: Reminder[] = [];

  // Day 5-7: surface archive type based on most-mentioned entry type
  if (daysSinceJoin >= 5 && !archiveType && entries.length >= 5) {
    const topType = detectMostMentioned(entries);
    reminders.push({
      id: "archive-type-offer",
      sisiLine: `you've mentioned ${topType} a few times now. would you like me to watch for them especially?`,
      action: { type: "pick-archive", suggested: topType },
    });
  }

  // Day 14: future-self letter offer
  if (daysSinceJoin >= 14 && !hasWrittenFutureLetter) {
    reminders.push({
      id: "future-letter-offer",
      sisiLine: "sísí is ready to keep a letter for you. would you like to write to who you'll be in a year?",
      action: { type: "open-future-letter" },
    });
  }

  // Any time: surface a quiet pattern (entity that went quiet)
  const pattern = detectQuietPattern(entries);
  if (pattern) {
    reminders.push({
      id: `pattern-${pattern.entity}`,
      sisiLine: `you haven't mentioned ${pattern.entity} recently. how is it?`,
      action: { type: "compose", tag: pattern.entity },
    });
  }

  return reminders;
}

// ── helpers ───────────────────────────────────────────────────────

function detectMostMentioned(entries: Entry[]): string {
  const counts: Record<string, number> = {};
  entries.forEach((e) => {
    const t = e.type ?? "thought";
    counts[t] = (counts[t] ?? 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "thoughts";
}

function detectQuietPattern(entries: Entry[]): { entity: string } | null {
  if (entries.length < 6) return null;

  // Count types in first half vs second half of entries
  const half = Math.floor(entries.length / 2);
  const recent = entries.slice(0, half);
  const older = entries.slice(half);

  const recentTypes = new Set(recent.map((e) => e.type).filter(Boolean));
  const olderTypes = new Set(older.map((e) => e.type).filter(Boolean));

  // Find a type that appeared in older entries but not in recent ones
  for (const t of olderTypes) {
    if (t && !recentTypes.has(t)) {
      return { entity: t + "s" }; // e.g. "dreams" → "you haven't mentioned dreams recently"
    }
  }
  return null;
}

// Convenience: load from localStorage and compute daysSinceJoin
export function getRemindersFromStorage(): Reminder[] {
  if (typeof window === "undefined") return [];

  const entries: Entry[] = JSON.parse(window.localStorage.getItem("sisi:entries") || "[]");
  const joined = window.localStorage.getItem("sisi:joined");
  const archiveType = window.localStorage.getItem("sisi:archiveType");
  const hasWrittenFutureLetter = window.localStorage.getItem("sisi:futureLetter") === "1";

  const daysSinceJoin = joined
    ? Math.floor((Date.now() - new Date(joined).getTime()) / 86_400_000)
    : 0;

  return getSoftReminders({ entries, daysSinceJoin, archiveType, hasWrittenFutureLetter });
}
