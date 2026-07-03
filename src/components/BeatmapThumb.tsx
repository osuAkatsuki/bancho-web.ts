import { useState } from "react";

import { beatmapThumbnailUrl } from "@/lib/assets";

interface BeatmapThumbProps {
  setId: number;
  className?: string;
}

/** Small beatmap set thumbnail with a quiet fallback when unavailable. */
export function BeatmapThumb({ setId, className = "" }: BeatmapThumbProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className={`block bg-surface-3 ${className}`} />;
  }

  return (
    <img
      src={beatmapThumbnailUrl(setId)}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className={`block object-cover ${className}`}
    />
  );
}
