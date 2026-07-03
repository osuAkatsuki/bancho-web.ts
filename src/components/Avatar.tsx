import { useEffect, useState } from "react";

import { useAuth } from "@/lib/auth";
import { avatarUrl } from "@/lib/assets";

// neutral osu!-style placeholder shown when a player has no avatar
const FALLBACK_AVATAR =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
      `<rect width="64" height="64" fill="#1c1e26"/>` +
      `<circle cx="32" cy="25" r="10" fill="#252833"/>` +
      `<path d="M12 56c2-12 10-17 20-17s18 5 20 17z" fill="#252833"/>` +
      `</svg>`,
  );

interface AvatarProps {
  playerId: number;
  alt?: string;
  className?: string;
}

export function Avatar({ playerId, alt = "", className = "" }: AvatarProps) {
  const { player, avatarVersion } = useAuth();
  const [failed, setFailed] = useState(false);

  // the signed-in player's avatar gets a version query so a fresh
  // upload replaces browser-cached copies everywhere immediately
  const bustCache = player?.id === playerId && avatarVersion > 0;
  const src = bustCache
    ? `${avatarUrl(playerId)}?v=${avatarVersion}`
    : avatarUrl(playerId);

  useEffect(() => setFailed(false), [src]);

  return (
    <img
      src={failed ? FALLBACK_AVATAR : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
