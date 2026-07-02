import * as React from "react";
import { cn } from "@/lib/utils";

const surfaceTone = {
  base: "bg-surface-container-lowest",
  low: "bg-surface-container-low",
} as const;

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: keyof typeof surfaceTone;
  /** Remove the default vertical padding (xl). */
  flush?: boolean;
}

/** Consistent section wrapper: vertical rhythm + max-width container (Fix Pass 3/6). */
export function Section({
  tone = "base",
  flush = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(surfaceTone[tone], !flush && "py-xl", className)} {...props}>
      <div className="mx-auto max-w-container-max px-gutter">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
}

export function SectionHeading({
  title,
  subtitle,
  align = "left",
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-lg",
        align === "center" && "text-center",
        action && "flex items-end justify-between gap-md"
      )}
    >
      <div className={cn(align === "center" && "mx-auto")}>
        <h2 className="mb-xs font-display text-headline-lg text-on-surface">{title}</h2>
        {subtitle && (
          <p
            className={cn(
              "font-body-md text-body-md text-on-surface-variant",
              align === "center" && "mx-auto max-w-2xl"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
