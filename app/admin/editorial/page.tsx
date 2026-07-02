import { EditorialManager } from "@/components/admin/editorial/editorial-manager";
import { getServiceSupabaseClient } from "@/lib/supabase-admin";

export default async function AdminEditorialPage() {
  const supabase = getServiceSupabaseClient();
  const [{ data: reviews }, { data: categories }] = await Promise.all([
    supabase
      .from("editorial_reviews")
      .select("id,title,slug,category_id,excerpt,main_image_url,published_at")
      .order("published_at", { ascending: false, nullsFirst: false }),
    supabase.from("categories").select("id,name").order("name"),
  ]);

  const categoryMap = new Map((categories ?? []).map((category) => [category.id, category.name]));

  return (
    <EditorialManager
      categories={categories ?? []}
      initialRows={(reviews ?? []).map((review) => ({
        id: review.id,
        title: review.title,
        slug: review.slug,
        category_id: review.category_id,
        category_name: review.category_id ? categoryMap.get(review.category_id) ?? null : null,
        excerpt: review.excerpt,
        main_image_url: review.main_image_url,
        published_at: review.published_at,
      }))}
    />
  );
}
