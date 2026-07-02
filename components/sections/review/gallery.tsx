"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryData {
  main: GalleryImage;
  thumbs: GalleryImage[];
}

export function ReviewGallery({ gallery }: { gallery: GalleryData }) {
  const images = [gallery.main, ...gallery.thumbs];
  const [active, setActive] = React.useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col gap-md">
      <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-surface-container-high">
        {current && (
          <Image
            src={current.src}
            alt={current.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <Badge variant="best-pick" className="absolute left-4 top-4 shadow-lg">
          Best Pick
        </Badge>
      </div>

      <div
        className="no-scrollbar flex gap-sm overflow-x-auto pb-2"
        role="tablist"
        aria-label="Product image thumbnails"
      >
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={img.alt}
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-square w-24 flex-shrink-0 overflow-hidden rounded-lg transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active === i
                ? "border-2 border-primary"
                : "border border-outline-variant opacity-60 hover:opacity-100"
            )}
          >
            <Image
              src={img.src}
              alt=""
              fill
              sizes="96px"
              loading="lazy"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
