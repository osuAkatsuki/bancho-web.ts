/** osu! client action ids (bancho.py's `Action` enum). */
const ACTIONS: Record<number, string> = {
  0: "Idle",
  1: "AFK",
  2: "Playing",
  3: "Editing",
  4: "Modding",
  5: "In multiplayer lobby",
  6: "Spectating",
  7: "Unknown",
  8: "Testing",
  9: "Submitting",
  10: "Paused",
  11: "In lobby",
  12: "Playing multiplayer",
  13: "Browsing osu!direct",
};

export function describeStatus(action: number, infoText: string): string {
  const verb = ACTIONS[action] ?? "Online";
  return infoText ? `${verb}: ${infoText}` : verb;
}
