import { Section, SectionHeading } from "./section";
import { ReviewCard } from "@/components/review-card";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { EditorialReview } from "@/lib/data";

interface LatestReviewsProps {
  reviews: EditorialReview[];
}

export function LatestReviews({ reviews }: LatestReviewsProps) {
  return (
    <Section tone="base">
      <SectionHeading title="Latest Editorial Reviews" />
      {reviews.length > 0 ? (
        <StaggerGroup className="grid grid-cols-1 gap-lg lg:grid-cols-2">
          {reviews.map((review) => (
            <StaggerItem key={review.id}>
              <ReviewCard review={review} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container p-lg text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            New editorial reviews are on the way — check back soon.
          </p>
        </div>
      )}
    </Section>
  );
}
