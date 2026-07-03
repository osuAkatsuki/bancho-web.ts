/**
 * bancho.py game modes (0-11):
 * 0-3 vanilla osu!/taiko/catch/mania, 4-6 relax osu!/taiko/catch,
 * 8 autopilot osu!. 7 and 9-11 are unused.
 */

export type Submode = "vanilla" | "relax" | "autopilot";

export const BASE_MODES = [
  { baseMode: 0, name: "osu!" },
  { baseMode: 1, name: "osu!taiko" },
  { baseMode: 2, name: "osu!catch" },
  { baseMode: 3, name: "osu!mania" },
] as const;

export const SUBMODES: { submode: Submode; name: string }[] = [
  { submode: "vanilla", name: "Vanilla" },
  { submode: "relax", name: "Relax" },
  { submode: "autopilot", name: "Autopilot" },
];

/** Combine a base mode & submode into a bancho.py mode id, if valid. */
export function toModeId(baseMode: number, submode: Submode): number | null {
  if (submode === "vanilla") return baseMode;
  if (submode === "relax") return baseMode <= 2 ? baseMode + 4 : null;
  return baseMode === 0 ? 8 : null; // autopilot
}

export function splitModeId(modeId: number): {
  baseMode: number;
  submode: Submode;
} {
  if (modeId === 8) return { baseMode: 0, submode: "autopilot" };
  if (modeId >= 4) return { baseMode: modeId - 4, submode: "relax" };
  return { baseMode: modeId, submode: "vanilla" };
}

export function isValidModeId(modeId: number): boolean {
  return [0, 1, 2, 3, 4, 5, 6, 8].includes(modeId);
}

export function modeName(modeId: number): string {
  const { baseMode, submode } = splitModeId(modeId);
  const base = BASE_MODES[baseMode]?.name ?? "osu!";
  if (submode === "relax") return `${base} (Relax)`;
  if (submode === "autopilot") return `${base} (Autopilot)`;
  return base;
}
