import { cn } from "@/lib/utils";

interface CategoryPillsProps {
  categories: string[];
}

// Shown when the DB returns no categories, so the strip never renders empty.
const FALLBACK_CATEGORIES = [
  "All",
  "Electronics",
  "Audio",
  "Kitchen",
  "Fitness",
  "Home",
  "Gaming",
];

export function CategoryPills({ categories }: CategoryPillsProps) {
  const items = categories.length > 0 ? categories : FALLBACK_CATEGORIES;
  return (
    <section className="overflow-hidden border-y border-outline-variant bg-surface-container-low py-md">
      <div className="mx-auto max-w-container-max px-gutter">
        <ul className="no-scrollbar flex gap-sm overflow-x-auto pb-2">
          {items.map((label, i) => (
            <li key={label}>
              <button
                type="button"
                className={cn(
                  "whitespace-nowrap rounded-full px-6 py-2.5 font-label-md text-label-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  i === 0
                    ? "bg-primary-container text-on-primary-container"
                    : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
