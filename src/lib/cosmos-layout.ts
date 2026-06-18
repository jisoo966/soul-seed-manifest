type ClusterLayout = {
  centerX: number;
  centerY: number;
  radius: number;
};

const CELLS = [
  { x: 0.25, y: 0.25 }, // top-left
  { x: 0.75, y: 0.25 }, // top-right
  { x: 0.25, y: 0.55 }, // mid-left
  { x: 0.75, y: 0.55 }, // mid-right
  { x: 0.5,  y: 0.8  }, // bottom-center
  { x: 0.5,  y: 0.4  }, // center fallback
];

export function layoutClusters(
  clusterIds: string[],
  viewBox = { w: 380, h: 480 },
): Record<string, ClusterLayout> {
  const result: Record<string, ClusterLayout> = {};
  clusterIds.slice(0, CELLS.length).forEach((id, i) => {
    result[id] = {
      centerX: CELLS[i].x * viewBox.w,
      centerY: CELLS[i].y * viewBox.h,
      radius: 50,
    };
  });
  return result;
}

export function layoutStarsInCluster(
  starCount: number,
  center: { x: number; y: number },
  radius: number,
  seed: number,
): Array<{ x: number; y: number }> {
  const rand = mulberry32(seed);
  return Array.from({ length: starCount }, () => {
    const angle = rand() * Math.PI * 2;
    const r = rand() * radius;
    return {
      x: center.x + Math.cos(angle) * r,
      y: center.y + Math.sin(angle) * r,
    };
  });
}

export function generateThreadsAroundCentroid(starCount: number): Array<[number, number]> {
  const threads: Array<[number, number]> = [];
  for (let i = 0; i < starCount - 1; i++) {
    threads.push([i, i + 1]);
  }
  if (starCount >= 4) threads.push([0, 2]);
  if (starCount >= 5) threads.push([1, 3]);
  return threads;
}

// Tiny seeded PRNG — same seed = same star positions every render
function mulberry32(seed: number) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
