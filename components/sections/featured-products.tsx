import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "./section";
import { ProductCard } from "@/components/product-card";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { Product } from "@/lib/data";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <Section tone="base">
      <SectionHeading
        title="Today's Featured Picks"
        subtitle="Hand-tested recommendations across our top categories."
        action={
          <Link
            href="/electronics"
            className="flex items-center gap-1 whitespace-nowrap font-label-md text-label-md text-primary-container hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View All Picks
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />
      <StaggerGroup className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
        {products.length > 0
          ? products.map((product) => (
              <StaggerItem key={product.id} className="h-full">
                <ProductCard product={product} variant="featured" />
              </StaggerItem>
            ))
          : // Skeleton placeholders so the grid never collapses to empty.
            Array.from({ length: 3 }).map((_, i) => (
              <StaggerItem key={`skeleton-${i}`} className="h-full">
                <div
                  className="flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container"
                  aria-hidden="true"
                >
                  <div className="aspect-square animate-pulse bg-surface-container-high" />
                  <div className="flex flex-grow flex-col gap-sm p-md">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-surface-container-high" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-surface-container-high" />
                    <div className="h-4 w-full animate-pulse rounded bg-surface-container-high" />
                    <div className="mt-auto h-9 w-1/2 animate-pulse rounded bg-surface-container-high" />
                  </div>
                </div>
              </StaggerItem>
            ))}
      </StaggerGroup>
    </Section>
  );
}
