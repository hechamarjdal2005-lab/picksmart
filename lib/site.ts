/* Centralized, env-driven config (Fix Pass 9). No hardcoded URLs in components. */

export const siteConfig = {
  name: "PickSmart",
  description:
    "Expert reviews & honest comparisons powered by real testing. We buy everything ourselves so you don't have to guess.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  affiliateBaseUrl:
    process.env.NEXT_PUBLIC_AFFILIATE_BASE_URL ?? "https://www.amazon.com",
  affiliateTag: process.env.NEXT_PUBLIC_AFFILIATE_TAG ?? "picksmart-20",
};

/** Build an affiliate link from the env-configured base + tag. */
export function affiliateLink(query: string): string {
  const url = new URL(`/s`, siteConfig.affiliateBaseUrl);
  url.searchParams.set("k", query);
  url.searchParams.set("tag", siteConfig.affiliateTag);
  return url.toString();
}
