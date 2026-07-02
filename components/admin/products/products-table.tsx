"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getBrowserSupabaseClient } from "@/lib/supabase-admin";
import { formatMoney } from "@/lib/admin-utils";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category_name: string | null;
  price: string | number | null;
  rating: string | number | null;
  is_featured: boolean;
  is_best_pick: boolean;
  is_amazon_choice: boolean;
};

export function ProductsTable({ initialRows }: { initialRows: ProductRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;

    const supabase = getBrowserSupabaseClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      window.alert(error.message);
      return;
    }

    setRows((current) => current.filter((row) => row.id !== id));
    router.refresh();
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Products</h1>
          <p className="mt-1 text-sm text-white/55">Manage product listings and review metadata.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-white/35" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name"
              className="border-white/10 bg-white/[0.03] pl-10 text-white placeholder:text-white/30"
            />
          </div>
          <Button asChild className="bg-[#FF6B00] text-black hover:bg-[#ff7b1f]">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/[0.02] text-left text-xs uppercase tracking-[0.22em] text-white/35">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Rating</th>
                <th className="px-5 py-4">Flags</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <tr key={row.id} className="text-sm text-white/78">
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{row.name}</div>
                      <div className="mt-1 text-xs text-white/40">{row.slug}</div>
                    </td>
                    <td className="px-5 py-4 text-white/65">{row.category_name ?? "Unassigned"}</td>
                    <td className="px-5 py-4 text-white/65">{formatMoney(row.price)}</td>
                    <td className="px-5 py-4 text-white/65">{row.rating ?? "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {row.is_featured ? <Badge variant="best-pick">Featured</Badge> : null}
                        {row.is_best_pick ? <Badge variant="amazon-choice">Best Pick</Badge> : null}
                        {row.is_amazon_choice ? <Badge variant="category">Amazon Choice</Badge> : null}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild size="sm" variant="ghost" className="text-white">
                          <Link href={`/admin/products/${row.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
                          onClick={() => void handleDelete(row.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-white/45">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
