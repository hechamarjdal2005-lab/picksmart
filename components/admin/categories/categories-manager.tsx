"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBrowserSupabaseClient } from "@/lib/supabase-admin";
import { slugify } from "@/lib/admin-utils";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  product_count: number;
};

type CategoryForm = {
  id: string | null;
  name: string;
  slug: string;
  icon: string;
};

const emptyForm = (): CategoryForm => ({
  id: null,
  name: "",
  slug: "",
  icon: "",
});

export function CategoriesManager({ initialRows }: { initialRows: CategoryRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = getBrowserSupabaseClient();
    const payload = {
      name: form.name.trim(),
      slug: slugify(form.slug || form.name),
      icon: form.icon.trim() || null,
    };

    const result = form.id
      ? await supabase.from("categories").update(payload).eq("id", form.id)
      : await supabase.from("categories").insert(payload);

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setForm(emptyForm());
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this category?")) return;

    const supabase = getBrowserSupabaseClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }

    window.location.reload();
  }

  function startEdit(row: CategoryRow) {
    setForm({
      id: row.id,
      name: row.name,
      slug: row.slug,
      icon: row.icon ?? "",
    });
    setError("");
  }

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Categories</h1>
          <p className="mt-1 text-sm text-white/55">Maintain category names, slugs, icons, and counts.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60">
          {rows.length} categories
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <Field label="Name">
          <Input
            value={form.name}
            onChange={(event) => {
              const value = event.target.value;
              setForm((current) => ({
                ...current,
                name: value,
                slug: current.slug ? current.slug : slugify(value),
              }));
            }}
            className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
            placeholder="Audio"
            required
          />
        </Field>
        <Field label="Slug">
          <Input
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))}
            className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
            placeholder="audio"
            required
          />
        </Field>
        <Field label="Icon">
          <Input
            value={form.icon}
            onChange={(event) => setForm((current) => ({ ...current, icon: event.target.value }))}
            className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
            placeholder="headphones"
          />
        </Field>
        <div className="flex items-end gap-3">
          <Button type="submit" className="bg-[#FF6B00] text-black hover:bg-[#ff7b1f]" disabled={loading}>
            {form.id ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {loading ? "Saving..." : form.id ? "Update" : "Add"}
          </Button>
          {form.id ? (
            <Button
              type="button"
              variant="ghost"
              className="text-white/70"
              onClick={() => setForm(emptyForm())}
            >
              Cancel
            </Button>
          ) : null}
        </div>
        {error ? <p className="lg:col-span-4 text-sm text-red-300">{error}</p> : null}
      </form>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/[0.02] text-left text-xs uppercase tracking-[0.22em] text-white/35">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Slug</th>
              <th className="px-5 py-4">Icon</th>
              <th className="px-5 py-4">Product Count</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-white/[0.02]">
            {rows.map((row) => (
              <tr key={row.id} className="text-sm text-white/75">
                <td className="px-5 py-4 font-medium text-white">{row.name}</td>
                <td className="px-5 py-4">{row.slug}</td>
                <td className="px-5 py-4">{row.icon ?? "—"}</td>
                <td className="px-5 py-4">{row.product_count}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" className="text-white" onClick={() => startEdit(row)}>
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
                      onClick={() => void handleDelete(row.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-white/75">{label}</Label>
      {children}
    </div>
  );
}
