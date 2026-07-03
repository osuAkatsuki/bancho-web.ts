/** osu! mod bitflags, mirroring bancho.py's `app.constants.mods.Mods`. */
export const Mods = {
  NOFAIL: 1 << 0,
  EASY: 1 << 1,
  TOUCHSCREEN: 1 << 2,
  HIDDEN: 1 << 3,
  HARDROCK: 1 << 4,
  SUDDENDEATH: 1 << 5,
  DOUBLETIME: 1 << 6,
  RELAX: 1 << 7,
  HALFTIME: 1 << 8,
  NIGHTCORE: 1 << 9,
  FLASHLIGHT: 1 << 10,
  AUTOPLAY: 1 << 11,
  SPUNOUT: 1 << 12,
  AUTOPILOT: 1 << 13,
  PERFECT: 1 << 14,
  KEY4: 1 << 15,
  KEY5: 1 << 16,
  KEY6: 1 << 17,
  KEY7: 1 << 18,
  KEY8: 1 << 19,
  FADEIN: 1 << 20,
  RANDOM: 1 << 21,
  CINEMA: 1 << 22,
  TARGET: 1 << 23,
  KEY9: 1 << 24,
  KEYCOOP: 1 << 25,
  KEY1: 1 << 26,
  KEY3: 1 << 27,
  KEY2: 1 << 28,
  SCOREV2: 1 << 29,
  MIRROR: 1 << 30,
} as const;

const MOD_ACRONYMS: [number, string][] = [
  [Mods.EASY, "EZ"],
  [Mods.NOFAIL, "NF"],
  [Mods.HALFTIME, "HT"],
  [Mods.HARDROCK, "HR"],
  [Mods.SUDDENDEATH, "SD"],
  [Mods.PERFECT, "PF"],
  [Mods.DOUBLETIME, "DT"],
  [Mods.NIGHTCORE, "NC"],
  [Mods.HIDDEN, "HD"],
  [Mods.FADEIN, "FI"],
  [Mods.FLASHLIGHT, "FL"],
  [Mods.RELAX, "RX"],
  [Mods.AUTOPILOT, "AP"],
  [Mods.SPUNOUT, "SO"],
  [Mods.AUTOPLAY, "AT"],
  [Mods.CINEMA, "CN"],
  [Mods.TARGET, "TP"],
  [Mods.TOUCHSCREEN, "TD"],
  [Mods.SCOREV2, "V2"],
  [Mods.MIRROR, "MR"],
  [Mods.RANDOM, "RD"],
  [Mods.KEY1, "1K"],
  [Mods.KEY2, "2K"],
  [Mods.KEY3, "3K"],
  [Mods.KEY4, "4K"],
  [Mods.KEY5, "5K"],
  [Mods.KEY6, "6K"],
  [Mods.KEY7, "7K"],
  [Mods.KEY8, "8K"],
  [Mods.KEY9, "9K"],
  [Mods.KEYCOOP, "CO"],
];

/** Convert a mods bitmask into display acronyms (e.g. 72 -> ["HD", "DT"]). */
export function getModAcronyms(mods: number): string[] {
  if (mods === 0) return [];

  // NC implies DT and PF implies SD; only show the stronger mod.
  let visible = mods;
  if (visible & Mods.NIGHTCORE) visible &= ~Mods.DOUBLETIME;
  if (visible & Mods.PERFECT) visible &= ~Mods.SUDDENDEATH;

  return MOD_ACRONYMS.filter(([bit]) => visible & bit).map(
    ([, acronym]) => acronym,
  );
}

export function formatMods(mods: number): string {
  const acronyms = getModAcronyms(mods);
  return acronyms.length > 0 ? `+${acronyms.join("")}` : "NM";
}
