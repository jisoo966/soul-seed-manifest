import { useMemo } from "react";

type Entry = { id: number; text: string; type: string | null; createdAt: string };

export type Cluster = {
  id: string;
  name: string;
  entryCount: number;
  metadata: string;
  state: "active" | "forming" | "resting";
};

const TYPE_LABELS: Record<string, string> = {
  sign:          "signs",
  synchronicity: "synchronicities",
  wish:          "wishes",
  dream:         "dreams",
  thought:       "thoughts",
  memory:        "memories",
};

const MOCK_CLUSTERS: Cluster[] = [
  { id: "wishes",   name: "wishes",   entryCount: 4, metadata: "since may",  state: "active"  },
  { id: "dreams",   name: "dreams",   entryCount: 3, metadata: "since june", state: "forming" },
  { id: "signs",    name: "signs",    entryCount: 2, metadata: "since june", state: "resting" },
];

const MOCK_OBSERVATIONS: Record<string, string> = {
  wishes:   "you keep returning to the same hope. it's still growing.",
  dreams:   "three dreams, all near water. sísí is watching.",
  signs:    "the signs are quiet. they're still there.",
};

export function useClusters() {
  return useMemo(() => {
    if (typeof window === "undefined") return emptyState();

    const raw: Entry[] = JSON.parse(window.localStorage.getItem("sisi:entries") || "[]");

    // Group entries by type
    const groups: Record<string, Entry[]> = {};
    raw.forEach((e) => {
      const key = e.type || "thought";
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });

    // If no real data, show mock clusters so the sky isn't empty
    const hasRealData = raw.length > 0;
    if (!hasRealData) {
      const mostActiveId = MOCK_CLUSTERS[0].id;
      return {
        clusters: MOCK_CLUSTERS,
        totalEntries: MOCK_CLUSTERS.reduce((s, c) => s + c.entryCount, 0),
        mostActiveId,
        mostActiveObservation: MOCK_OBSERVATIONS[mostActiveId],
        hasUnplantedWish: false,
      };
    }

    // Build real clusters from entries
    const clusters: Cluster[] = Object.entries(groups)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([type, entries], i): Cluster => {
        const oldest = entries[entries.length - 1];
        const sinceDate = new Date(oldest.createdAt).toLocaleDateString("en-US", { month: "long" });
        return {
          id: type,
          name: TYPE_LABELS[type] ?? type,
          entryCount: entries.length,
          metadata: `since ${sinceDate.toLowerCase()}`,
          state: i === 0 ? "active" : i === 1 ? "forming" : "resting",
        };
      });

    const mostActiveId = clusters[0]?.id ?? "";
    const mostActiveObservation =
      clusters[0]?.entryCount >= 3
        ? `you keep returning to your ${clusters[0].name}. sísí is watching.`
        : "the sky is growing. keep planting.";

    // hasUnplantedWish: true if most recent entry was < 10s ago
    const latestEntry = raw[0];
    const hasUnplantedWish = latestEntry
      ? Date.now() - latestEntry.id < 10_000
      : false;

    return { clusters, totalEntries: raw.length, mostActiveId, mostActiveObservation, hasUnplantedWish };
  }, []);
}

function emptyState() {
  return {
    clusters: [] as Cluster[],
    totalEntries: 0,
    mostActiveId: "",
    mostActiveObservation: "",
    hasUnplantedWish: false,
  };
}
