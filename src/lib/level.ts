/**
 * osu! level calculation from total score, matching the formula used
 * across the private server ecosystem (ripple, guweb, etc).
 */

const MAX_LEVEL = 120;

function requiredScoreForLevel(level: number): number {
  if (level <= 100) {
    if (level >= 2) {
      return (
        (5000 / 3) * (4 * level ** 3 - 3 * level ** 2 - level) +
        1.25 * 1.8 ** (level - 60)
      );
    }
    return 1;
  }
  return 26_931_190_829 + 100_000_000_000 * (level - 100);
}

export interface Level {
  level: number;
  /** progress towards the next level, 0-1 */
  progress: number;
}

export function getLevel(totalScore: number): Level {
  let level = 1;
  while (
    level < MAX_LEVEL &&
    requiredScoreForLevel(level + 1) <= totalScore
  ) {
    level += 1;
  }

  const current = requiredScoreForLevel(level);
  const next = requiredScoreForLevel(level + 1);
  const progress = Math.min(
    Math.max((totalScore - current) / (next - current), 0),
    1,
  );

  return { level, progress };
}
