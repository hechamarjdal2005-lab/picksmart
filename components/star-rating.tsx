import * as React from "react";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  /** Rating out of 5 (supports .5 halves). */
  value: number;
  size?: number;
  className?: string;
  /** Optional trailing label text, e.g. "(4.8)". */
  showValue?: boolean;
}

/**
 * Accessible star rating. The icon row is decorative (aria-hidden); the whole
 * group exposes a single readable label like "Rated 4.5 out of 5 stars"
 * (audit 10.3 — the imported markup had bare, unlabeled star spans).
 */
export function StarRating({ value, size = 18, className, showValue }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const position = i + 1;
    if (value >= position) return "full" as const;
    if (value >= position - 0.5) return "half" as const;
    return "empty" as const;
  });

  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      role="img"
      aria-label={`Rated ${value} out of 5 stars`}
    >
      <span className="flex text-primary" aria-hidden="true">
        {stars.map((kind, i) => (
          <Icon
            key={i}
            name={kind === "half" ? "star_half" : "star"}
            fill={kind === "full"}
            size={size}
            className={kind === "empty" ? "text-outline" : undefined}
          />
        ))}
      </span>
      {showValue && (
        <span className="font-label-md text-label-md text-on-surface-variant">
          ({value.toFixed(1)})
        </span>
      )}
    </span>
  );
}
