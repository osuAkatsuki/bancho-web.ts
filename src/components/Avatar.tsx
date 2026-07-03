import { useState } from "react";

import { avatarUrl } from "@/lib/assets";

// neutral osu!-style placeholder shown when a player has no avatar
const FALLBACK_AVATAR =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
      `<rect width="64" height="64" fill="#2c2438"/>` +
      `<circle cx="32" cy="25" r="10" fill="#3d3450"/>` +
      `<path d="M12 56c2-12 10-17 20-17s18 5 20 17z" fill="#3d3450"/>` +
      `</svg>`,
  );

interface AvatarProps {
  playerId: number;
  alt?: string;
  className?: string;
}

export function Avatar({ playerId, alt = "", className = "" }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  return (
    <img
      src={failed ? FALLBACK_AVATAR : avatarUrl(playerId)}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
