import { Section } from "./section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/motion/reveal";

export function Newsletter() {
  return (
    <Section tone="base">
      <Reveal variant="fadeUp">
        <div className="flex flex-col items-center justify-between gap-lg rounded-xl border-l-8 border-primary-container bg-surface-container-low p-lg md:flex-row">
          <div>
            <h2 className="mb-xs font-display text-headline-lg text-on-surface">
              Get Weekly Deals in Your Inbox
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              The best discounts, price drops, and editorial picks delivered every
              Friday.
            </p>
          </div>
          <form
            className="flex w-full gap-sm md:w-auto"
            // Newsletter endpoint wired via env in a real deployment (Fix Pass 9).
          >
            <Label htmlFor="newsletter-email" className="sr-only">
              Email address
            </Label>
            <Input
              id="newsletter-email"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full md:w-64"
            />
            <Button type="submit" className="whitespace-nowrap">
              Join Now
            </Button>
          </form>
        </div>
      </Reveal>
    </Section>
  );
}
