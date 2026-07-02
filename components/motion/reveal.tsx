"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { fadeUp, fadeIn, scaleIn } from "@/lib/motion";
import { useReveal } from "./use-reveal";

type VariantName = "fadeUp" | "fadeIn" | "scaleIn";

const map = { fadeUp, fadeIn, scaleIn };

interface RevealProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  variant?: VariantName;
  /** Delay in seconds before this element animates in. */
  delay?: number;
  as?: keyof typeof motion;
}

/**
 * Scroll-triggered entrance wrapper. Reveals as the element enters the viewport
 * (Fix Pass 4), with a mount fallback (useReveal) so content is never left stuck
 * at opacity:0 when it can't be scrolled into view. Honors prefers-reduced-motion:
 * the variant collapses to a pure opacity fade at the same duration (Fix Pass 6).
 */
export function Reveal({
  variant = "fadeUp",
  delay = 0,
  children,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion() ?? false;
  const variants = map[variant](reduced);
  const ref = React.useRef<HTMLDivElement>(null);
  const animate = useReveal(ref);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={animate}
      variants={variants}
      transition={delay ? { delay } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
