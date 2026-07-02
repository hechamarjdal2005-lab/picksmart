"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import {
  staggerContainer,
  fadeUp,
  fadeIn,
  scaleIn,
} from "@/lib/motion";
import { useReveal } from "./use-reveal";

const map = { fadeUp, fadeIn, scaleIn };
type VariantName = keyof typeof map;

/**
 * Parent that staggers its StaggerItem children into view. Stagger delay is
 * removed under reduced motion (Fix Pass 6) so items just fade together.
 */
export function StaggerGroup({
  children,
  ...props
}: HTMLMotionProps<"div">) {
  const reduced = useReducedMotion() ?? false;
  const ref = React.useRef<HTMLDivElement>(null);
  const animate = useReveal(ref);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={animate}
      variants={staggerContainer(reduced)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends HTMLMotionProps<"div"> {
  variant?: VariantName;
}

export function StaggerItem({
  variant = "fadeUp",
  children,
  ...props
}: StaggerItemProps) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div variants={map[variant](reduced)} {...props}>
      {children}
    </motion.div>
  );
}
