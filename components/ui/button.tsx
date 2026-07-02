import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
  Variants map 1:1 to the Stitch design-system button specs:
  - primary   → solid #ff6b00 (primary-container), hover brightens
  - secondary → transparent w/ blue (secondary-container) border + tint hover
  - outline   → neutral outline-variant border (the "Read Review" button)
  - ghost / link for low-emphasis actions
  Min height 44px on default/lg/icon for accessible tap targets (Fix Pass 7).
*/
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-xs whitespace-nowrap rounded-lg font-label-md text-label-md font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-container text-on-primary-container hover:brightness-110 shadow-sm",
        secondary:
          "border border-secondary-container text-secondary-container hover:bg-secondary-container/10",
        outline:
          "border border-outline-variant text-on-surface hover:bg-surface-variant",
        ghost: "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface",
        link: "text-primary-container underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 py-2",
        lg: "h-12 px-8 py-3 text-headline-sm",
        pill: "h-11 px-6 rounded-full",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        // Explicit type prevents accidental form submits (Fix Pass 8).
        type={asChild ? undefined : type ?? "button"}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
