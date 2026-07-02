import { getServiceSupabaseClient } from "@/lib/supabase-admin";
import { ProductsTable } from "@/components/admin/products/products-table";

export default async function AdminProductsPage() {
  const supabase = getServiceSupabaseClient();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("id,name,slug,price,rating,is_featured,is_best_pick,is_amazon_choice,category_id")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("id,name"),
  ]);

  const categoryMap = new Map((categories ?? []).map((category) => [category.id, category.name]));

  return (
    <ProductsTable
      initialRows={(products ?? []).map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        category_name: categoryMap.get(product.category_id ?? "") ?? null,
        price: product.price,
        rating: product.rating,
        is_featured: Boolean(product.is_featured),
        is_best_pick: Boolean(product.is_best_pick),
        is_amazon_choice: Boolean(product.is_amazon_choice),
      }))}
    />
  );
}
