import { NewsletterManager } from "@/components/admin/newsletter/newsletter-manager";
import { getServiceSupabaseClient } from "@/lib/supabase-admin";

export default async function AdminNewsletterPage() {
  const supabase = getServiceSupabaseClient();
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("id,email,created_at")
    .order("created_at", { ascending: false });

  return <NewsletterManager initialRows={subscribers ?? []} />;
}
