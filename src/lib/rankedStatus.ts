/** Server-side beatmap ranked statuses (bancho.py's `RankedStatus`). */

interface StatusDisplay {
  label: string;
  colorClass: string;
}

const STATUSES: Record<number, StatusDisplay> = {
  [-1]: { label: "Unsubmitted", colorClass: "bg-surface-3 text-muted" },
  0: { label: "Unranked", colorClass: "bg-surface-3 text-muted" },
  1: { label: "Outdated", colorClass: "bg-surface-3 text-muted" },
  2: { label: "Ranked", colorClass: "bg-sky-400/15 text-sky-300" },
  3: { label: "Approved", colorClass: "bg-emerald-400/15 text-emerald-300" },
  4: { label: "Qualified", colorClass: "bg-amber-400/15 text-amber-300" },
  5: { label: "Loved", colorClass: "bg-accent-soft text-accent" },
};

export function rankedStatusDisplay(status: number): StatusDisplay {
  return STATUSES[status] ?? { label: "Unknown", colorClass: "bg-surface-3 text-muted" };
}

/** Maps with these statuses award pp & appear on "best" score listings. */
export function givesPerformance(status: number): boolean {
  return status === 2 || status === 3;
}
