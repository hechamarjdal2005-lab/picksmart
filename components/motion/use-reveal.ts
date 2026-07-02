"use client";

import * as React from "react";
import { useInView } from "framer-motion";

/**
 * Drives the `animate` prop of a scroll-reveal wrapper.
 *
 * Returns "visible" once the element scrolls into view (the intended effect),
 * but ALSO flips to "visible" a moment after mount even if it never enters the
 * viewport. Without this fallback, sections wrapped in `initial="hidden"` (opacity:0)
 * stay permanently invisible whenever the user can't scroll them into view —
 * e.g. a short/non-scrolling page or below-the-fold content that's never reached.
 * That was the cause of the "sections below the hero don't render" bug.
 */
export function useReveal(ref: React.RefObject<Element>): "hidden" | "visible" {
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [fallback, setFallback] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setFallback(true), 600);
    return () => clearTimeout(t);
  }, []);

  return inView || fallback ? "visible" : "hidden";
}
