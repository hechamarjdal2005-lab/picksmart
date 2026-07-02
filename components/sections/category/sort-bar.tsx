"use client";

import * as React from "react";
import { categoryFilters } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SortBar({ total }: { total: number }) {
  const [active, setActive] = React.useState(categoryFilters.sorts[0]);

  return (
    <div className="mb-lg flex flex-col items-center justify-between gap-md rounded-xl border border-outline-variant bg-surface-container-lowest px-md py-sm sm:flex-row">
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Showing 1-{total} of 124 products
      </p>
      <div className="flex items-center gap-md font-label-md text-label-md">
        <span className="text-on-surface-variant">Sort by:</span>
        <div
          className="flex rounded-lg bg-surface-container p-1"
          role="group"
          aria-label="Sort products"
        >
          {categoryFilters.sorts.map((sort) => (
            <button
              key={sort}
              type="button"
              aria-pressed={active === sort}
              onClick={() => setActive(sort)}
              className={cn(
                "rounded-md px-md py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active === sort
                  ? "bg-primary-container font-bold text-on-primary-container"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {sort}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
