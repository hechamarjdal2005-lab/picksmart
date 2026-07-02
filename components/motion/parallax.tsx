"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

/*
  Scroll-linked motion (Fix Pass 5) built purely on motion values — no
  position:fixed hacks. Reduced motion disables the transform entirely.
*/

interface ParallaxProps extends Omit<HTMLMotionProps<"div">, "ref" | "style"> {
  /** Scroll speed multiplier. <1 lags behind (background), >1 leads (foreground). */
  speed?: number;
  children: React.ReactNode;
}

/**
 * Translates the element vertically relative to page scroll.
 * speed 0.4 → background drifts slowly; speed 0.85 → foreground tracks closely.
 */
export function Parallax({ speed = 0.4, className, children, ...props }: ParallaxProps) {
  const reduced = useReducedMotion() ?? false;
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Map the element's scroll progress to a vertical offset. The drift amount is
  // proportional to (1 - speed): slower layers move more, foreground moves less.
  const distance = (1 - speed) * 160;
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div
      ref={ref}
      style={reduced ? undefined : { y }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hero scale-out: scales from 1 → 1.08 as the hero scrolls out of view,
 * per the brief. Reduced motion keeps it static.
 */
export function HeroScale({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6]);

  return (
    <motion.div
      ref={ref}
      style={reduced ? undefined : { scale, opacity }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
