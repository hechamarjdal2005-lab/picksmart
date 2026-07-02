import { ProductForm } from "@/components/admin/products/product-form";
import { getServiceSupabaseClient } from "@/lib/supabase-admin";

export default async function NewProductPage() {
  const supabase = getServiceSupabaseClient();
  const { data: categories } = await supabase.from("categories").select("id,name,slug").order("name");

  return <ProductForm mode="create" categories={categories ?? []} />;
}
