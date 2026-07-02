import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { EditorialReview } from "@/lib/data";

/** Editorial review card used in the home "Latest Reviews" grid. */
export function ReviewCard({ review }: { review: EditorialReview }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container transition-all hover:border-primary-container md:flex-row">
      <div className="overflow-hidden md:w-1/2">
        <div className="relative aspect-video h-full w-full">
          <Image
            src={review.image}
            alt={review.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center p-md md:w-1/2">
        <span className="mb-xs font-label-md text-label-md uppercase tracking-widest text-primary-container">
          {review.kicker}
        </span>
        <h3 className="mb-sm font-display text-headline-sm text-on-surface transition-colors group-hover:text-primary">
          {review.title}
        </h3>
        <p className="mb-md font-body-sm text-body-sm text-on-surface-variant">
          {review.blurb}
        </p>
        <Link
          href={review.href}
          className="flex items-center gap-1 font-label-md text-label-md font-bold text-on-surface transition-all group-hover:gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Read Guide
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
