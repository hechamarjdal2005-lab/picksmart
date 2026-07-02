"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { StarRating } from "@/components/star-rating";
import { categoryFilters } from "@/lib/data";
import { cn } from "@/lib/utils";

export function FilterSidebar() {
  const [price, setPrice] = React.useState<number[]>([2000]);

  return (
    <aside className="w-full flex-shrink-0 lg:w-[280px]">
      <div className="sticky top-[96px] rounded-xl border border-outline-variant bg-surface-container p-md">
        {/* Categories */}
        <div className="mb-lg">
          <h2 className="mb-md font-display text-headline-sm text-on-surface">
            Categories
          </h2>
          <ul className="space-y-sm">
            {categoryFilters.categories.map((cat) => (
              <li key={cat.name}>
                <a
                  href="#"
                  aria-current={cat.active ? "true" : undefined}
                  className={cn(
                    "flex justify-between font-body-md text-body-md transition-colors hover:text-primary",
                    cat.active ? "font-bold text-primary" : "text-on-surface"
                  )}
                >
                  {cat.name}
                  <span className="text-body-sm text-on-surface-variant">
                    {cat.count}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div className="mb-lg">
          <h2 className="mb-md font-display text-headline-sm text-on-surface">
            Price Range
          </h2>
          <div className="px-2">
            <Slider
              value={price}
              onValueChange={setPrice}
              min={0}
              max={2000}
              step={50}
              aria-label="Maximum price"
            />
            <div className="mt-sm flex justify-between font-label-md text-label-md text-on-surface-variant">
              <span>$0</span>
              <span>${price[0]}{price[0] === 2000 ? "+" : ""}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-lg">
          <h2 className="mb-md font-display text-headline-sm text-on-surface">
            Rating
          </h2>
          <div className="space-y-sm">
            <Label className="group flex cursor-pointer items-center gap-sm">
              <Checkbox />
              <StarRating value={4} size={20} />
              <span className="text-body-sm text-on-surface-variant group-hover:text-on-surface">
                &amp; up
              </span>
            </Label>
          </div>
        </div>

        {/* Brand */}
        <div>
          <h2 className="mb-md font-display text-headline-sm text-on-surface">Brand</h2>
          <div className="no-scrollbar max-h-48 space-y-sm overflow-y-auto pr-2">
            {categoryFilters.brands.map((brand) => (
              <Label
                key={brand.name}
                className="flex cursor-pointer items-center gap-sm"
              >
                <Checkbox defaultChecked={brand.checked} />
                <span className="text-body-md text-on-surface-variant">
                  {brand.name}
                </span>
              </Label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
