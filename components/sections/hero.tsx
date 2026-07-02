"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";
import { Parallax, HeroScale } from "@/components/motion/parallax";
import { Product } from "@/lib/data";

interface HeroProps {
  product: Product | null;
}

export function Hero({ product }: HeroProps) {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      <div className="mx-auto grid w-full max-w-container-max grid-cols-1 items-center gap-xl px-gutter lg:grid-cols-2">
        {/* Foreground text — tracks scroll closely (0.85x) */}
        <Parallax speed={0.85} className="z-10">
          <Reveal variant="fadeUp">
            <h1 className="mb-sm font-display text-display-lg-mobile tracking-tighter text-on-surface md:text-display-lg">
              Find the Best Products.{" "}
              <span className="text-primary-container">Every Time.</span>
            </h1>
          </Reveal>
          <Reveal variant="fadeUp" delay={0.1}>
            <p className="mb-lg max-w-xl font-body-lg text-body-lg text-on-surface-variant">
              Expert reviews &amp; honest comparisons powered by real testing. We
              buy everything ourselves so you don&apos;t have to guess.
            </p>
          </Reveal>
          <Reveal variant="fadeUp" delay={0.2}>
            <div className="flex flex-wrap gap-md">
              <Button size="lg">Explore Top Picks</Button>
              <Button size="lg" variant="secondary">
                Browse Categories
              </Button>
            </div>
          </Reveal>
        </Parallax>

        {/* Decorative product card — hidden on small screens, skipped if no product */}
        {product && (
        <div className="relative hidden lg:block">
          {/* Background glow drifts slowly (0.4x) */}
          <Parallax
            speed={0.4}
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary-container/20 blur-[100px]"
          >
            <span className="sr-only" />
          </Parallax>

          <HeroScale>
            <div className="group relative rotate-2 rounded-xl border border-outline-variant bg-surface-container-high p-6 transition-transform duration-300 hover:rotate-0 hover:scale-105 hover:shadow-glow">
              <div className="mb-md aspect-video overflow-hidden rounded-lg bg-surface-container-highest">
                <Image
                  src={product.image}
                  alt={product.alt}
                  width={640}
                  height={360}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
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
            </div>
          </HeroScale>
        </div>
        )}
      </div>
    </section>
  );
}
