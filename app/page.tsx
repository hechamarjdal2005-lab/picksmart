import { HeroAnimated } from "@/components/hero-animated";
import { CategoryPills } from "@/components/sections/category-pills";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { WhyTrust } from "@/components/sections/why-trust";
import { LatestReviews } from "@/components/sections/latest-reviews";
import { Newsletter } from "@/components/sections/newsletter";
import { 
  getHeroProduct, 
  getCategoryPills, 
  getFeaturedProducts, 
  getLatestReviews 
} from "@/lib/data";

export default async function HomePage() {
  const [heroProduct, categoryPills, featuredProducts, latestReviews] = await Promise.all([
    getHeroProduct(),
    getCategoryPills(),
    getFeaturedProducts(),
    getLatestReviews(),
  ]);

  return (
    <>
      <HeroAnimated product={heroProduct} />
      <CategoryPills categories={categoryPills} />
      <FeaturedProducts products={featuredProducts} />
      <WhyTrust />
      <LatestReviews reviews={latestReviews} />
      <Newsletter />
    </>
  );
}
