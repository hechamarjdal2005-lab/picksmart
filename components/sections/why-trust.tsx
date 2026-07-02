import { Section, SectionHeading } from "./section";
import { Icon } from "@/components/icon";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { trustPoints } from "@/lib/data";

export function WhyTrust() {
  return (
    <Section tone="low">
      <SectionHeading
        align="center"
        title="Why PickSmart?"
        subtitle="We cut through the noise with data-driven testing and unbiased editorial integrity."
      />
      <StaggerGroup className="grid grid-cols-1 gap-lg md:grid-cols-3">
        {trustPoints.map((point) => (
          <StaggerItem key={point.title}>
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg text-center">
              <div className="mx-auto mb-md flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/10">
                <Icon name={point.icon} size={36} className="text-primary-container" />
              </div>
              <h3 className="mb-xs font-display text-headline-sm text-on-surface">
                {point.title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {point.body}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
