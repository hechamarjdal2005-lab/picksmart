import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Focus state restores a visible ring (audit 5.3 / 10.1): the imported
  markup used `focus:ring-0`. Here focus transitions the border to blue
  (secondary) per the design-system Input spec and adds a focus-visible ring.
*/
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-lg border border-outline-variant bg-surface-container-highest px-md py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant",
          "transition-colors focus-visible:outline-none focus-visible:border-secondary-container focus-visible:ring-2 focus-visible:ring-secondary-container/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
