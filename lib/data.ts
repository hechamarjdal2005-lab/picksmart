import { supabase } from "./supabase";

export type BadgeKind = "best-pick" | "amazon-choice" | "deal" | "category";

export interface Product {
  id: string;
  slug: string;
  name: string;
  blurb: string;
  price: string;
  oldPrice?: string;
  rating: number; // out of 5
  reviews?: string;
  image: string;
  alt: string;
  badges: { label: string; kind: BadgeKind }[];
}

export interface EditorialReview {
  id: string;
  kicker: string;
  title: string;
  blurb: string;
  href: string;
  image: string;
  alt: string;
}

function mapProduct(p: any): Product {
  const badges: { label: string; kind: BadgeKind }[] = [];
  if (p.is_best_pick) badges.push({ label: "Best Pick", kind: "best-pick" });
  if (p.is_amazon_choice) badges.push({ label: "Amazon Choice", kind: "amazon-choice" });
  if (p.old_price && p.old_price > p.price) badges.push({ label: "Deal", kind: "deal" });
  
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    blurb: p.blurb || "",
    price: p.price ? `$${Number(p.price).toFixed(2)}` : "TBD",
    oldPrice: p.old_price ? `$${Number(p.old_price).toFixed(2)}` : undefined,
    rating: Number(p.rating),
    reviews: p.reviews_count ? p.reviews_count.toLocaleString() : "0",
    image: p.main_image_url || "",
    alt: p.main_image_alt || p.name,
    badges: badges,
  };
}

/* ---------------------------------------------------------------- Fetchers */

export async function getHeroProduct(): Promise<Product | null> {
  try {
    // maybeSingle() returns null (not an error) when no product is flagged
    // is_hero, so a DB with no hero set never crashes the page.
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_hero", true)
      .limit(1)
      .maybeSingle();

    if (data) return mapProduct(data);

    // Fallback: no explicit hero flagged — surface the first featured product
    // (or any product) so the hero never renders empty.
    const { data: fallback } = await supabase
      .from("products")
      .select("*")
      .order("is_featured", { ascending: false })
      .limit(1)
      .maybeSingle();

    return fallback ? mapProduct(fallback) : null;
  } catch (err) {
    console.error("[data] getHeroProduct failed:", err);
    return null;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .limit(3);

    if (error || !data) return [];
    return data.map(mapProduct);
  } catch (err) {
    console.error("[data] getFeaturedProducts failed:", err);
    return [];
  }
}

export async function getCategoryPills(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("name")
      .order("name");

    if (error || !data) return [];
    return data.map((c: any) => c.name);
  } catch (err) {
    console.error("[data] getCategoryPills failed:", err);
    return [];
  }
}

export async function getLatestReviews(): Promise<EditorialReview[]> {
  try {
    // For now, mapping featured products as editorial reviews to fulfill UI
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .limit(2);

    if (error || !data) return [];
    return data.map((p: any) => ({
      id: p.id,
      kicker: "Review",
      title: p.name,
      blurb: p.blurb || "",
      href: `/reviews/${p.slug}`,
      image: p.main_image_url || "",
      alt: p.main_image_alt || p.name,
    }));
  } catch (err) {
    console.error("[data] getLatestReviews failed:", err);
    return [];
  }
}

export async function getCategoryProducts(categorySlug?: string): Promise<Product[]> {
  let query = supabase.from("products").select("*, categories!inner(slug)");
  
  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (name, slug),
      quick_specs (*),
      pros_cons (*),
      review_sections (*),
      gallery_images (*),
      comparisons (*)
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return {
    ...mapProduct(data),
    category: data.categories,
    quickSpecs: data.quick_specs.sort((a: any, b: any) => a.sort_order - b.sort_order),
    pros: data.pros_cons.filter((i: any) => i.type === "pro").map((i: any) => i.content),
    cons: data.pros_cons.filter((i: any) => i.type === "con").map((i: any) => i.content),
    verdict: data.verdict,
    body: data.review_sections.sort((a: any, b: any) => a.sort_order - b.sort_order).map((s: any) => ({
      heading: s.heading,
      text: s.content,
      image: s.image_url ? { src: s.image_url, alt: s.image_alt } : undefined,
    })),
    gallery: {
      main: { src: data.main_image_url, alt: data.main_image_alt },
      thumbs: data.gallery_images.map((g: any) => ({ src: g.image_url, alt: g.image_alt })),
    },
    comparison: data.comparisons.map((c: any) => ({
      name: c.compare_product_name,
      anc: c.anc_rating,
      battery: c.battery_life,
      price: c.price_display,
      current: c.is_current,
      image: c.compare_product_image_url,
      alt: c.compare_product_image_alt,
    })),
  };
}

export async function getSiteSettings(): Promise<{ logoUrl: string | null }> {
  try {
    const { data } = await supabase
      .from("site_settings")
      .select("logo_url")
      .eq("id", 1)
      .maybeSingle();

    return { logoUrl: data?.logo_url ?? null };
  } catch {
    return { logoUrl: null };
  }
}

/* ----------------------------------------------------------- Static Content */

export const trustPoints = [
  {
    icon: "hardware" as const,
    title: "Tested Hands-On",
    body: "Every product we recommend goes through our rigorous lab testing and real-world usage protocols.",
  },
  {
    icon: "verified" as const,
    title: "No Sponsored Content",
    body: "Our reviews are 100% independent. Brands cannot pay for positive reviews or placement on our lists.",
  },
  {
    icon: "update" as const,
    title: "Updated Weekly",
    body: "The market moves fast. We update our guides weekly to ensure you're always getting the best available value.",
  },
];

export const footerColumns = [
  {
    title: "Company",
    links: ["About Us", "Editorial Policy", "Contact", "Careers"],
  },
  {
    title: "Shopping",
    links: ["Best Picks", "Amazon Choices", "Deals", "Coupons"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Cookies", "Affiliate Info"],
  },
];

export const footerBlurb =
  "PickSmart is your go-to destination for professional, unbiased product reviews and expert recommendations. We test, you choose.";

export const affiliateDisclosure =
  "© 2024 PickSmart. All rights reserved. Affiliate Disclosure: We may earn commissions from qualifying purchases made through our links, at no extra cost to you. This helps support our independent testing lab.";

export const categoryFilters = {
  categories: [
    { name: "Laptops", count: 24, active: false },
    { name: "Audio", count: 18, active: true },
    { name: "Monitors", count: 12, active: false },
    { name: "Peripherals", count: 31, active: false },
    { name: "Cameras", count: 9, active: false },
  ],
  brands: [
    { name: "Apple", checked: false },
    { name: "Bose", checked: true },
    { name: "Razer", checked: false },
    { name: "Sony", checked: false },
  ],
  sorts: ["Relevance", "Price", "Rating", "Newest"],
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/electronics" },
  { label: "Reviews", href: "/reviews/sony-wh1000xm5" },
  { label: "Deals", href: "#" },
  { label: "About", href: "#" },
];
