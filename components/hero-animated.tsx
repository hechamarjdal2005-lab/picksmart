"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import type { Product } from "@/lib/data";

interface HeroAnimatedProps {
  product: Product | null;
}

const ease = [0.22, 1, 0.36, 1] as const;

/* Headline split for word-by-word stagger. Accent words render in the
   primary-container orange to match the original static hero. */
const HEADLINE: { text: string; accent?: boolean }[] = [
  { text: "Find" },
  { text: "the" },
  { text: "Best" },
  { text: "Products." },
  { text: "Every", accent: true },
  { text: "Time.", accent: true },
];

/* Deterministic particle field — hardcoded (not Math.random) so the server
   and client render identical markup and there is no hydration mismatch.
   Color is #FF6B00 at 30% opacity, sizes 3–6px, durations 3–7s, varied delay. */
const PARTICLES = [
  { left: "8%", top: "18%", size: 4, duration: 4.5, delay: 0 },
  { left: "22%", top: "6%", size: 3, duration: 6, delay: 0.6 },
  { left: "78%", top: "10%", size: 5, duration: 5.5, delay: 1.2 },
  { left: "92%", top: "30%", size: 3, duration: 7, delay: 0.3 },
  { left: "12%", top: "52%", size: 6, duration: 3.5, delay: 1.5 },
  { left: "4%", top: "82%", size: 4, duration: 5, delay: 0.9 },
  { left: "30%", top: "92%", size: 3, duration: 6.5, delay: 0.2 },
  { left: "62%", top: "88%", size: 5, duration: 4, delay: 1.1 },
  { left: "88%", top: "70%", size: 4, duration: 5.8, delay: 0.5 },
  { left: "96%", top: "54%", size: 3, duration: 3, delay: 1.8 },
  { left: "48%", top: "4%", size: 4, duration: 6.2, delay: 0.8 },
  { left: "70%", top: "44%", size: 5, duration: 7, delay: 1.4 },
];

export function HeroAnimated({ product }: HeroAnimatedProps) {
  const reduced = useReducedMotion() ?? false;

  // Normalised pointer offset within the card, range roughly -0.5..0.5.
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePos({ x, y });
  };

  const resetCard = () => {
    setHovering(false);
    setMousePos({ x: 0, y: 0 });
  };

  const wordVariant: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  };

  const headlineContainer: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.08, delayChildren: 0.1 },
    },
  };

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      {/* ---- Background glow orbs (behind everything) ---- */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 z-0 h-[28rem] w-[28rem] rounded-full bg-[#FF6B00]/20"
        style={{ filter: "blur(80px)" }}
        animate={reduced ? undefined : { scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 z-0 h-[26rem] w-[26rem] rounded-full bg-[#2D8CFF]/[0.15]"
        style={{ filter: "blur(80px)" }}
        animate={reduced ? undefined : { scale: [1.2, 1, 1.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-container-max grid-cols-1 items-center gap-xl px-gutter lg:grid-cols-2">
        {/* ---- Left: text ---- */}
        <div>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={headlineContainer}
            className="mb-sm font-display text-display-lg-mobile tracking-tighter text-on-surface md:text-display-lg"
          >
            {HEADLINE.map((word, i) => (
              <motion.span
                key={`${word.text}-${i}`}
                variants={wordVariant}
                className={`inline-block ${word.accent ? "text-primary-container" : ""}`}
              >
                {word.text}
                {/* trailing space preserved between words */}
                {i < HEADLINE.length - 1 ? " " : ""}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.6 }}
            className="mb-lg max-w-xl font-body-lg text-body-lg text-on-surface-variant"
          >
            Expert reviews &amp; honest comparisons powered by real testing. We
            buy everything ourselves so you don&apos;t have to guess.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: reduced ? 1 : 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease, delay: 0.9 }}
            className="flex flex-wrap gap-md"
          >
            <Button size="lg">Explore Top Picks</Button>
            <Button size="lg" variant="secondary">
              Browse Categories
            </Button>
          </motion.div>
        </div>

        {/* ---- Right: animated 3D product card ---- */}
        {product && (
          <div
            className="relative hidden lg:block"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={resetCard}
          >
            {/* Floating dots around the card */}
            {!reduced &&
              PARTICLES.map((p, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  className="pointer-events-none absolute rounded-full bg-[#FF6B00]/30"
                  style={{
                    left: p.left,
                    top: p.top,
                    width: p.size,
                    height: p.size,
                  }}
                  animate={{ y: [0, -14, 0], opacity: [0.3, 0.65, 0.3] }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

            {/* Floating loop + perspective parent for the 3D tilt */}
            <motion.div
              style={{ perspective: 1000 }}
              animate={reduced ? undefined : { y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* The tilting card itself */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 24,
                  boxShadow: "0 0 15px rgba(255, 107, 0, 0.12)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotateX: reduced ? 0 : mousePos.y * -20,
                  rotateY: reduced ? 0 : mousePos.x * 20,
                  scale: hovering ? 1.03 : 1,
                  boxShadow: hovering
                    ? "0 0 45px rgba(255, 107, 0, 0.38)"
                    : "0 0 15px rgba(255, 107, 0, 0.12)",
                }}
                transition={{
                  opacity: { duration: 0.6, ease },
                  y: { duration: 0.6, ease },
                  rotateX: { type: "spring", stiffness: 150, damping: 20 },
                  rotateY: { type: "spring", stiffness: 150, damping: 20 },
                  scale: { type: "spring", stiffness: 200, damping: 22 },
                  boxShadow: { duration: 0.3, ease },
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative rounded-xl border border-outline-variant bg-surface-container-high p-6"
              >
                {/* Product image — slides in from the right + subtle rotateY hint */}
                <motion.div
                  initial={{ opacity: 0, x: reduced ? 0 : 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.2 }}
                  className="mb-md aspect-video overflow-hidden rounded-lg bg-surface-container-highest"
                >
                  <motion.div
                    animate={
                      reduced
                        ? undefined
                        : {
                            rotateY: [0, 5, 0],
                            filter: [
                              "drop-shadow(0 0 0 rgba(255,107,0,0))",
                              "drop-shadow(0 8px 20px rgba(255,107,0,0.35))",
                              "drop-shadow(0 0 0 rgba(255,107,0,0))",
                            ],
                          }
                    }
                    transition={{
                      rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                      filter: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    }}
                    className="h-full w-full"
                  >
                    <Image
                      src={product.image}
                      alt={product.alt}
                      width={640}
                      height={360}
                      priority
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                </motion.div>

                <div className="mb-xs flex items-start justify-between">
                  <Badge variant="amazon-choice">Amazon Choice</Badge>
                  <div className="flex items-center gap-1 text-primary-container">
                    <Icon name="star" fill size={18} />
                    <span className="font-bold text-body-sm">{product.rating}</span>
                  </div>
                </div>
                <h2 className="mb-xs font-display text-headline-sm">{product.name}</h2>
                <p className="mb-md font-body-sm text-body-sm text-on-surface-variant">
                  {product.blurb}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-headline-md text-on-surface">
                    {product.price}
                  </span>
                  <button
                    type="button"
                    className="flex items-center gap-1 font-label-md text-label-md text-primary-container hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    View Specs
                    <Icon name="chevron_right" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
