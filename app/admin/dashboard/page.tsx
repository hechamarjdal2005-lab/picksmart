import { BarChart3, Boxes, FolderTree, Newspaper, Settings, Users } from "lucide-react";
import { getServiceSupabaseClient } from "@/lib/supabase-admin";

async function getStats() {
  const supabase = getServiceSupabaseClient();

  const [products, categories, subscribers, featuredProducts] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_featured", true),
  ]);

  return [
    { label: "Total Products", value: products.count ?? 0, icon: Boxes },
    { label: "Total Categories", value: categories.count ?? 0, icon: FolderTree },
    { label: "Total Subscribers", value: subscribers.count ?? 0, icon: Users },
    { label: "Featured Products", value: featuredProducts.count ?? 0, icon: BarChart3 },
  ];
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Overview</h1>
        <p className="mt-2 text-sm text-white/55">Live snapshots from your Supabase data.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className="rounded-xl border border-[#2A2A3A] bg-[#12121A] p-6"
            >
              <div className="flex items-start justify-between">
                <div className="text-4xl font-bold text-white">{stat.value}</div>
                <div className="rounded-lg bg-[#FF6B00]/10 p-2.5 text-[#FF6B00]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 text-sm text-white/60">{stat.label}</div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="rounded-xl border border-[#2A2A3A] bg-[#12121A] p-6">
          <h2 className="text-lg font-semibold text-white">Admin activity</h2>
          <p className="mt-2 text-sm text-white/55">
            Use the sidebar to manage products, categories, editorial reviews, subscribers,
            and settings.
          </p>
        </section>
        <section className="rounded-xl border border-[#FF6B00]/20 bg-[#FF6B00]/[0.08] p-6">
          <h2 className="text-lg font-semibold text-white">Quick links</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li>Products and product imagery</li>
            <li>Categories and icon mapping</li>
            <li>Editorial reviews and publishing</li>
            <li>Newsletter exports and cleanup</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
