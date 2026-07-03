import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  /**
   * Standard card padding (px-6 py-5). Disable for cards with
   * edge-to-edge content (tables, banners, media) — these get
   * overflow-hidden so children clip to the rounded corners.
   */
  padded?: boolean;
  className?: string;
}

/** The standard surface container used across the site. */
export function Card({ children, padded = true, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface ${
        padded ? "px-5 py-4" : "overflow-hidden"
      } ${className}`}
    >
      {children}
    </div>
  );
}
