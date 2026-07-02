import type { Variants } from "framer-motion";

/*
  Central motion system. One small set of variants reused everywhere
  (Fix Pass 4). Each is a function of `reduced` so that when the user
  prefers reduced motion we keep the SAME duration but strip physical
  movement, scale and blur — only a clean opacity fade remains (Fix Pass 6).
*/

export const DURATION = 0.5;
export const STAGGER = 0.08;

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function fadeUp(reduced: boolean): Variants {
  return {
    hidden: reduced
      ? { opacity: 0 }
      : { opacity: 0, y: 24, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: DURATION, ease },
    },
  };
}

export function fadeIn(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: DURATION, ease },
    },
  };
}

export function scaleIn(reduced: boolean): Variants {
  return {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: DURATION, ease },
    },
  };
}

/** Parent container that staggers children in. */
export function staggerContainer(reduced: boolean): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : STAGGER,
        delayChildren: 0.05,
      },
    },
  };
}

export const viewportOnce = { once: true, amount: 0.2 } as const;
