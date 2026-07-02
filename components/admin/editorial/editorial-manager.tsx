"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBrowserSupabaseClient } from "@/lib/supabase-admin";
import { formatDate, sanitizeFileName, slugify } from "@/lib/admin-utils";

type CategoryOption = {
  id: string;
  name: string;
};

type EditorialRow = {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  category_name: string | null;
  excerpt: string | null;
  main_image_url: string | null;
  published_at: string | null;
};

type EditorialForm = {
  id: string | null;
  title: string;
  slug: string;
  category_id: string | null;
  excerpt: string;
  published_at: string;
  main_image_url: string;
};

const emptyForm = (categoryId: string | null): EditorialForm => ({
  id: null,
  title: "",
  slug: "",
  category_id: categoryId,
  excerpt: "",
  published_at: new Date().toISOString().slice(0, 10),
  main_image_url: "",
});

export function EditorialManager({
  initialRows,
  categories,
}: {
  initialRows: EditorialRow[];
  categories: CategoryOption[];
}) {
  const [rows, setRows] = useState(initialRows);
  const [form, setForm] = useState<EditorialForm>(emptyForm(categories[0]?.id ?? null));
  const [previewUrl, setPreviewUrl] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [progressLabel, setProgressLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm((current) => ({ ...current, category_id: current.category_id ?? categories[0]?.id ?? null }));
  }, [categories]);

  function startEdit(row: EditorialRow) {
    setForm({
      id: row.id,
      title: row.title,
      slug: row.slug,
      category_id: row.category_id,
      excerpt: row.excerpt ?? "",
      published_at: row.published_at ? row.published_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
      main_image_url: row.main_image_url ?? "",
    });
    setPreviewUrl(row.main_image_url ?? "");
    setError("");
  }

  async function uploadImage(file: File) {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Only JPG, PNG, and WEBP files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    const slug = slugify(form.slug || form.title || "editorial");
    const path = `editorial/${slug}/${sanitizeFileName(file.name)}`;
    const supabase = getBrowserSupabaseClient();

    setError("");
    setProgress(10);
    setProgressLabel("Preparing upload...");

    const { error: uploadError } = await supabase.storage.from("images").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

    if (uploadError) {
      setProgress(null);
      setProgressLabel("");
      setError(uploadError.message);
      return;
    }

    setProgress(70);
    setProgressLabel("Resolving public URL...");
    const { data } = supabase.storage.from("images").getPublicUrl(path);
    setForm((current) => ({ ...current, main_image_url: data.publicUrl }));
    setPreviewUrl(data.publicUrl);
    setProgress(100);
    setProgressLabel("Upload complete.");
    window.setTimeout(() => {
      setProgress(null);
      setProgressLabel("");
    }, 1200);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    await uploadImage(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = getBrowserSupabaseClient();
    const payload = {
      title: form.title.trim(),
      slug: slugify(form.slug || form.title),
      category_id: form.category_id,
      excerpt: form.excerpt.trim() || null,
      main_image_url: form.main_image_url.trim() || null,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
    };

    const result = form.id
      ? await supabase.from("editorial_reviews").update(payload).eq("id", form.id)
      : await supabase.from("editorial_reviews").insert(payload);

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setForm(emptyForm(categories[0]?.id ?? null));
    setPreviewUrl("");
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this editorial review?")) return;

    const supabase = getBrowserSupabaseClient();
    const { error } = await supabase.from("editorial_reviews").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }

    window.location.reload();
  }

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Editorial Reviews</h1>
          <p className="mt-1 text-sm text-white/55">Create, edit, and publish editorial review entries.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <Field label="Title">
          <Input
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                title: event.target.value,
                slug: current.slug ? current.slug : slugify(event.target.value),
              }))
            }
            className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
            placeholder="Top 10 Noise-Canceling Headphones"
            required
          />
        </Field>
        <Field label="Slug">
          <Input
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))}
            className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
            placeholder="top-10-noise-canceling-headphones"
            required
          />
        </Field>
        <Field label="Category">
          <select
            value={form.category_id ?? ""}
            onChange={(event) => setForm((current) => ({ ...current, category_id: event.target.value || null }))}
            className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-white outline-none"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Published">
          <Input
            value={form.published_at}
            type="date"
            onChange={(event) => setForm((current) => ({ ...current, published_at: event.target.value }))}
            className="border-white/10 bg-white/[0.03] text-white"
          />
        </Field>
        <div className="flex items-end gap-3">
          <Button type="submit" className="bg-[#FF6B00] text-black hover:bg-[#ff7b1f]" disabled={loading}>
            {form.id ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {loading ? "Saving..." : form.id ? "Update" : "Add"}
          </Button>
          {form.id ? (
            <Button type="button" variant="ghost" className="text-white/70" onClick={() => setForm(emptyForm(categories[0]?.id ?? null))}>
              Cancel
            </Button>
          ) : null}
        </div>
        <div className="lg:col-span-5 space-y-4">
          <Field label="Excerpt">
            <textarea
              value={form.excerpt}
              onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
              placeholder="Short editorial summary"
            />
          </Field>
          <Field label="Image Upload">
            <div className="space-y-4 rounded-2xl border border-dashed border-white/15 bg-black/20 p-4">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="block w-full text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-[#FF6B00] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-[#ff7b1f]"
              />
              {previewUrl ? (
                <img src={previewUrl} alt={form.title || "Editorial preview"} className="aspect-video w-full rounded-xl object-cover" />
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-xl border border-white/10 text-sm text-white/40">
                  No image selected
                </div>
              )}
            </div>
          </Field>
        </div>
        {error ? <p className="lg:col-span-5 text-sm text-red-300">{error}</p> : null}
        {progress !== null ? (
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/35">
              <span>Image upload</span>
              <span>{progressLabel}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-[#FF6B00]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}
      </form>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/[0.02] text-left text-xs uppercase tracking-[0.22em] text-white/35">
            <tr>
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Published</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-white/[0.02]">
            {rows.map((row) => (
              <tr key={row.id} className="text-sm text-white/75">
                <td className="px-5 py-4 font-medium text-white">
                  <div>{row.title}</div>
                  <div className="mt-1 text-xs text-white/35">{row.slug}</div>
                </td>
                <td className="px-5 py-4">{row.category_name ?? "Unassigned"}</td>
                <td className="px-5 py-4">{formatDate(row.published_at)}</td>
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
