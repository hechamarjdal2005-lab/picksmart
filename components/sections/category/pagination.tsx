import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const pages = [1, 2, 3];

export function Pagination() {
  return (
    <nav
      className="mt-xl flex items-center justify-center gap-sm"
      aria-label="Pagination"
    >
      <button
        type="button"
        aria-label="Previous page"
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-all hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`Page ${page}`}
          aria-current={page === 1 ? "page" : undefined}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            page === 1
              ? "bg-primary-container text-on-primary-container"
              : "border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
          )}
        >
          {page}
        </button>
      ))}
      <span className="px-2 text-on-surface-variant" aria-hidden="true">
        ...
      </span>
      <button
        type="button"
        aria-label="Page 10"
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-all hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        10
      </button>
      <button
        type="button"
        aria-label="Next page"
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-all hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </nav>
  );
}
