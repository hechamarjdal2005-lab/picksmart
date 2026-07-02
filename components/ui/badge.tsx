import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
  Badge variants map directly to the Stitch design-system badge spec:
  best-pick → orange, amazon-choice → blue, deal → red, category → tertiary.
  Replaces the imported `bg-red-600 text-white` / raw-color one-offs with tokens.
*/
const badgeVariants = cva(
  "inline-flex items-center rounded-full font-label-md text-label-md px-3 py-1 uppercase tracking-wider",
  {
    variants: {
      variant: {
        "best-pick": "bg-primary-container text-on-primary-container",
        "amazon-choice": "bg-secondary-container text-white",
        deal: "bg-deal text-white",
        category: "bg-tertiary-container text-on-tertiary-container",
      },
      radius: {
        full: "rounded-full",
        rounded: "rounded",
      },
    },
    defaultVariants: {
      variant: "best-pick",
      radius: "full",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, radius, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, radius }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
