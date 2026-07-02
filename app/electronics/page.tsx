import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { FilterSidebar } from "@/components/sections/category/filter-sidebar";
import { SortBar } from "@/components/sections/category/sort-bar";
import { Pagination } from "@/components/sections/category/pagination";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { getCategoryProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Best Electronics of 2024",
  description:
    "Expert-tested rankings of the best electronics of 2024 — laptops, audio, monitors and more.",
};

export default async function ElectronicsPage() {
  const products = await getCategoryProducts('electronics');

  return (
    <div className="mx-auto min-h-screen max-w-container-max px-gutter">
      {/* Header */}
      <section className="py-lg">
        <nav
          aria-label="Breadcrumb"
          className="mb-sm flex items-center gap-xs font-body-sm text-body-sm text-on-surface-variant"
        >
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-on-surface" aria-current="page">
            Electronics
          </span>
        </nav>
        <h1 className="font-display text-headline-lg text-on-surface">
          Best Electronics of 2024
        </h1>
      </section>

      <div className="flex flex-col gap-lg pb-xl lg:flex-row">
        <FilterSidebar />

        <section className="flex-grow" aria-label="Product results">
          <SortBar total={products.length} />

          <StaggerGroup className="grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-3">
            {products.map((product, i) => (
              <StaggerItem key={product.id} className="h-full">
                <ProductCard
                  product={product}
                  variant="category"
                  priority={i < 3}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Pagination />
        </section>
      </div>
    </div>
  );
}
