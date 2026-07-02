import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { StarRating } from "@/components/star-rating";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
import { ReviewGallery } from "@/components/sections/review/gallery";
import { getProductBySlug } from "@/lib/data";
import { affiliateLink } from "@/lib/site";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.name} Review | PickSmart`,
    description: product.blurb,
  };
}

export default async function ReviewPage({ params }: { params: { slug: string } }) {
  const r = await getProductBySlug(params.slug);

  if (!r) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: r.category?.name || "Category", href: r.category ? `/${r.category.slug}` : "#" },
    { label: r.name, href: null },
  ];

  return (
    <div className="mx-auto max-w-container-max px-gutter pb-xl pt-md">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-lg flex items-center gap-xs font-body-sm text-body-sm text-on-surface-variant"
      >
        {breadcrumbs.map((bc, i) => (
          <span key={bc.label} className="flex items-center gap-xs">
            {bc.href ? (
              <Link href={bc.href} className="hover:text-primary">
                {bc.label}
              </Link>
            ) : (
              <span className="font-medium text-on-surface" aria-current="page">
                {bc.label}
              </span>
            )}
            {i < breadcrumbs.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </span>
        ))}
      </nav>

      {/* Top: gallery + details */}
      <section className="mb-xl grid grid-cols-1 gap-xl lg:grid-cols-2">
        <Reveal variant="fadeIn">
          <ReviewGallery gallery={r.gallery} />
        </Reveal>

        <Reveal variant="fadeUp" className="flex flex-col">
          <h1 className="mb-sm font-display text-headline-lg text-on-surface">
            {r.name}
          </h1>
          <div className="mb-md flex items-center gap-sm">
            <StarRating value={r.rating} size={22} />
            <span className="font-body-md text-on-surface-variant">
              ({r.rating}/5 from {r.reviews} reviews)
            </span>
          </div>
          <div className="mb-lg">
            <div className="mb-xs font-display text-[40px] font-bold leading-tight text-primary-container">
              {r.price}
            </div>
            {r.oldPrice && (
              <div className="font-body-sm text-on-surface-variant">
                List Price: <span className="line-through">{r.oldPrice}</span>
              </div>
            )}
          </div>

          <Button asChild size="lg" className="mb-md w-full shadow-glow">
            <a
              href={affiliateLink(r.name)}
              target="_blank"
              rel="noopener noreferrer sponsored"
            >
              <Icon name="shopping_cart" />
              Check on Amazon
            </a>
          </Button>

          <div className="mb-xl flex items-center gap-xs font-body-sm text-on-surface-variant">
            <Icon name="update" size={18} />
            Last updated: Oct 2024
          </div>

          <dl className="grid grid-cols-2 gap-md rounded-xl border border-outline-variant bg-surface-container-low p-md">
            {r.quickSpecs.map((spec: any) => (
              <div key={spec.label} className="flex flex-col">
                <dt className="mb-xs font-label-md text-label-md text-on-surface-variant">
                  {spec.label}
                </dt>
                <dd className="font-bold text-on-surface">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* Pros / Cons / Verdict */}
      <section className="mb-xl">
        <div className="mb-lg grid grid-cols-1 gap-lg md:grid-cols-2">
          <Reveal
            variant="fadeUp"
            className="rounded-xl border-l-4 border-success bg-surface-container-low p-lg"
          >
            <h2 className="mb-md flex items-center gap-xs font-display text-headline-sm">
              <Icon name="thumb_up" className="text-success" />
              Pros
            </h2>
            <ul className="space-y-sm">
              {r.pros.map((pro: string) => (
                <li key={pro} className="flex gap-sm">
                  <Icon name="check_circle" className="flex-shrink-0 text-success" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            variant="fadeUp"
            delay={0.1}
            className="rounded-xl border-l-4 border-deal bg-surface-container-low p-lg"
          >
            <h2 className="mb-md flex items-center gap-xs font-display text-headline-sm">
              <Icon name="thumb_down" className="text-deal" />
              Cons
            </h2>
            <ul className="space-y-sm text-on-surface-variant">
              {r.cons.map((con: string) => (
                <li key={con} className="flex gap-sm">
                  <Icon name="cancel" className="flex-shrink-0 text-deal" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {r.verdict && (
          <Reveal
            variant="scaleIn"
            className="relative overflow-hidden rounded-xl border-l-[6px] border-primary-container bg-surface-container/60 p-lg backdrop-blur-md"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 opacity-10" aria-hidden="true">
              <Icon name="verified" size={200} />
            </div>
            <div className="relative z-10">
              <h2 className="mb-sm font-display text-headline-md text-primary">
                Our Verdict
              </h2>
              <p className="max-w-4xl font-body-lg text-body-lg leading-relaxed">
                {r.verdict}
              </p>
            </div>
          </Reveal>
        )}
      </section>

      {/* Body */}
      <section className="mx-auto mb-xl max-w-4xl space-y-lg">
        {r.body.map((block: any) => (
          <Reveal key={block.heading} variant="fadeUp" className="space-y-md">
            <h2 className="font-display text-headline-lg text-on-surface">
              {block.heading}
            </h2>
            <p className="text-on-surface-variant">{block.text}</p>
            {block.image && (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-surface-container-high">
                <Image
                  src={block.image.src}
                  alt={block.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            )}
          </Reveal>
        ))}
      </section>

      {/* Comparison table */}
      {r.comparison && r.comparison.length > 0 && (
        <section className="mb-xl">
          <h2 className="mb-lg text-center font-display text-headline-lg text-on-surface">
            How It Compares
          </h2>
          <div className="overflow-x-auto rounded-xl border border-outline-variant">
            <table className="w-full border-collapse bg-surface-container-lowest text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  <th className="p-md font-label-md uppercase tracking-wider">Product</th>
                  <th className="p-md font-label-md uppercase tracking-wider">ANC Quality</th>
                  <th className="p-md font-label-md uppercase tracking-wider">Battery</th>
                  <th className="p-md font-label-md uppercase tracking-wider">Price</th>
                  <th className="p-md text-right font-label-md uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {r.comparison.map((row: any) => (
                  <tr key={row.name} className={row.current ? "bg-primary/5" : undefined}>
                    <td className="p-md">
                      <div className="flex items-center gap-sm">
                        <div className="relative h-12 w-12 overflow-hidden rounded bg-surface-container-high">
                          <Image
                            src={row.image || "/placeholder-product.png"}
                            alt={row.alt || row.name}
                            fill
                            sizes="48px"
                            loading="lazy"
                            className="object-cover"
                          />
                        </div>
                        <span className={row.current ? "font-bold" : "font-medium"}>
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-md">{row.anc}</td>
                    <td className="p-md">{row.battery}</td>
                    <td className={`p-md font-bold ${row.current ? "text-primary" : ""}`}>
                      {row.price}
                    </td>
                    <td className="p-md text-right">
                      {row.current ? (
                        <Badge variant="best-pick" radius="rounded" className="normal-case">
                          Current Pick
                        </Badge>
                      ) : (
                        <a
                          href={affiliateLink(row.name)}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="text-sm font-bold text-tertiary-container hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          View Deal
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {r.category?.id && (
        <RelatedProducts categoryId={r.category.id} currentProductId={r.id} />
      )}
    </div>
  );
}

async function RelatedProducts({ categoryId, currentProductId }: { categoryId: string, currentProductId: string }) {
  const { data: related, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .neq("id", currentProductId)
    .limit(3);

  if (error || !related || related.length === 0) return null;

  return (
    <section className="mb-xl">
      <h2 className="mb-lg font-display text-headline-lg text-on-surface">
        Related Best Picks
      </h2>
      <StaggerGroup className="grid grid-cols-1 gap-md md:grid-cols-3">
        {related.map((item: any) => (
          <StaggerItem key={item.id}>
            <article className="group overflow-hidden rounded-xl border border-outline-variant bg-surface-container transition-all hover:border-primary-container hover:shadow-glow-lg">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={item.main_image_url || ""}
                  alt={item.main_image_alt || item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge
                  variant="amazon-choice"
                  radius="rounded"
                  className="absolute right-2 top-2 text-[10px]"
                >
                  Best Pick
                </Badge>
              </div>
              <div className="p-md">
                <h3 className="mb-xs font-display text-headline-sm">{item.name}</h3>
                <div className="mb-md font-bold text-primary-container">
                  ${item.price}
                </div>
                <Button asChild variant="secondary" className="w-full">
                  <Link href={`/reviews/${item.slug}`}>Read Review</Link>
                </Button>
              </div>
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
