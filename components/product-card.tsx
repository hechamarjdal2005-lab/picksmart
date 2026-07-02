import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import { affiliateLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Product, BadgeKind } from "@/lib/data";

const badgeVariantFor: Record<BadgeKind, "best-pick" | "amazon-choice" | "deal" | "category"> = {
  "best-pick": "best-pick",
  "amazon-choice": "amazon-choice",
  deal: "deal",
  category: "category",
};

interface ProductCardProps {
  product: Product;
  /** "featured" = home grid, "category" = listing grid with sale price + rating value. */
  variant?: "featured" | "category";
  /** Skip native lazy-loading for above-the-fold cards. */
  priority?: boolean;
}

export function ProductCard({
  product,
  variant = "featured",
  priority = false,
}: ProductCardProps) {
  const leftBadge = product.badges[0];
  const rightBadge = product.badges[1];

  return (
    <Card
      as="article"
      className="group flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary-container hover:shadow-glow"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-container-high">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          loading={priority ? undefined : "lazy"}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {leftBadge && (
          <Badge
            variant={badgeVariantFor[leftBadge.kind]}
            radius={variant === "featured" ? "rounded" : "full"}
            className="absolute left-sm top-sm"
          >
            {leftBadge.label}
          </Badge>
        )}
        {rightBadge && (
          <Badge
            variant={badgeVariantFor[rightBadge.kind]}
            className="absolute right-sm top-sm"
          >
            {rightBadge.label}
          </Badge>
        )}
      </div>

      <div className="flex flex-grow flex-col p-md">
        {variant === "category" ? (
          <>
            <h3 className="mb-xs font-display text-headline-sm text-on-surface">
              {product.name}
            </h3>
            <p className="mb-md line-clamp-1 font-body-sm text-body-sm text-on-surface-variant">
              {product.blurb}
            </p>
            <div className="mb-sm flex items-center gap-xs">
              <StarRating value={product.rating} size={18} showValue />
            </div>
          </>
        ) : (
          <>
            <StarRating value={product.rating} size={16} className="mb-xs" />
            <h3 className="mb-xs font-display text-headline-sm text-on-surface">
              {product.name}
            </h3>
            <p className="mb-md flex-grow font-body-sm text-body-sm text-on-surface-variant">
              {product.blurb}
            </p>
          </>
        )}

        <div className="mt-auto">
          <div className="mb-md flex items-center gap-sm">
            <span className="font-display text-headline-md text-primary-container">
              {product.price}
            </span>
            {product.oldPrice && (
              <span className="font-label-md text-label-md text-on-surface-variant line-through">
                {product.oldPrice}
              </span>
            )}
          </div>

          <div className={cn("gap-sm", variant === "category" ? "flex flex-col" : "grid grid-cols-2")}>
            {variant === "category" ? (
              <>
                <Button asChild className="w-full">
                  <a
                    href={affiliateLink(product.name)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                  >
                    View on Amazon
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/reviews/${product.slug}`}>Read Review</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href={`/reviews/${product.slug}`}>Read Review</Link>
                </Button>
                <Button asChild>
                  <a
                    href={affiliateLink(product.name)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                  >
                    Amazon
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
