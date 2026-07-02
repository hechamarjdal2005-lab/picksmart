import * as React from "react";
import { cn } from "@/lib/utils";

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Material Symbols ligature name, e.g. "star", "chevron_right". */
  name: string;
  /** Render the filled variant (used for active stars). */
  fill?: boolean;
  /** Pixel size; defaults to inheriting font-size. */
  size?: number;
  /**
   * Accessible label. When omitted the icon is decorative and hidden from
   * assistive tech (aria-hidden) — the common case, since icon-only buttons
   * carry their own aria-label (Fix Pass 8).
   */
  label?: string;
}

export function Icon({ name, fill, size, label, className, style, ...props }: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      data-fill={fill ? "1" : "0"}
      style={size ? { fontSize: size, ...style } : style}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      {...props}
    >
      {name}
    </span>
  );
}
