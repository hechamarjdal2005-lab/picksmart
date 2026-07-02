import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/products/product-form";
import { getServiceSupabaseClient } from "@/lib/supabase-admin";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = getServiceSupabaseClient();

  const [productResult, categoriesResult, specsResult, prosConsResult] = await Promise.all([
    supabase
      .from("products")
      .select("id,name,slug,category_id,blurb,price,old_price,rating,reviews_count,verdict,main_image_url,main_image_alt,is_featured,is_best_pick,is_amazon_choice")
      .eq("id", params.id)
      .single(),
    supabase.from("categories").select("id,name,slug").order("name"),
    supabase.from("quick_specs").select("label,value,sort_order").eq("product_id", params.id).order("sort_order"),
    supabase.from("pros_cons").select("type,content,sort_order").eq("product_id", params.id).order("sort_order"),
  ]);

  if (productResult.error || !productResult.data) {
    notFound();
  }

  const product = productResult.data;
  const quickSpecs = (specsResult.data ?? []).map((spec) => ({
    label: spec.label,
    value: spec.value,
  }));
  const pros = (prosConsResult.data ?? [])
    .filter((item) => item.type === "pro")
    .map((item) => item.content);
  const cons = (prosConsResult.data ?? [])
    .filter((item) => item.type === "con")
    .map((item) => item.content);

  return (
    <ProductForm
      mode="edit"
      categories={categoriesResult.data ?? []}
      initialProduct={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        category_id: product.category_id,
        blurb: product.blurb,
        price: product.price,
        old_price: product.old_price,
        rating: product.rating,
        reviews_count: product.reviews_count,
        verdict: product.verdict,
        main_image_url: product.main_image_url,
        main_image_alt: product.main_image_alt,
        is_featured: Boolean(product.is_featured),
        is_best_pick: Boolean(product.is_best_pick),
        is_amazon_choice: Boolean(product.is_amazon_choice),
        quickSpecs,
        pros,
        cons,
      }}
    />
  );
}
