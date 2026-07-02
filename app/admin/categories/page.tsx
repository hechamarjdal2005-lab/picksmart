import { CategoriesManager } from "@/components/admin/categories/categories-manager";
import { getServiceSupabaseClient } from "@/lib/supabase-admin";

export default async function AdminCategoriesPage() {
  const supabase = getServiceSupabaseClient();
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("id,name,slug,icon").order("name"),
    supabase.from("products").select("category_id"),
  ]);

  const productCounts = new Map<string, number>();
  (products ?? []).forEach((product) => {
    if (!product.category_id) return;
    productCounts.set(product.category_id, (productCounts.get(product.category_id) ?? 0) + 1);
  });

  return (
    <CategoriesManager
      initialRows={(categories ?? []).map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        product_count: productCounts.get(category.id) ?? 0,
      }))}
    />
  );
}
