"use client";

import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBrowserSupabaseClient } from "@/lib/supabase-admin";
import { formatDateTime, toCsv } from "@/lib/admin-utils";

type SubscriberRow = {
  id: string;
  email: string;
  created_at: string | null;
};

export function NewsletterManager({ initialRows }: { initialRows: SubscriberRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [error, setError] = useState("");

  function exportCsv() {
    const csv = toCsv(
      rows.map((row) => ({
        email: row.email,
        created_at: row.created_at ?? "",
      })),
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "newsletter-subscribers.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this subscriber?")) return;

    const supabase = getBrowserSupabaseClient();
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }

    setRows((current) => current.filter((row) => row.id !== id));
  }

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Newsletter Subscribers</h1>
          <p className="mt-1 text-sm text-white/55">Review, export, and prune newsletter subscribers.</p>
        </div>
        <Button className="bg-[#FF6B00] text-black hover:bg-[#ff7b1f]" onClick={exportCsv}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/[0.02] text-left text-xs uppercase tracking-[0.22em] text-white/35">
            <tr>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Created At</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-white/[0.02]">
            {rows.map((row) => (
              <tr key={row.id} className="text-sm text-white/75">
                <td className="px-5 py-4 font-medium text-white">{row.email}</td>
                <td className="px-5 py-4">{formatDateTime(row.created_at)}</td>
                <td className="px-5 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
                    onClick={() => void handleDelete(row.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
