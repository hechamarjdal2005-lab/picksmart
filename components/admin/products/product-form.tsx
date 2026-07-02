"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBrowserSupabaseClient } from "@/lib/supabase-admin";
import { sanitizeFileName, slugify, toNumberOrNull } from "@/lib/admin-utils";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type Spec = { label: string; value: string };

type ProductRecord = {
  id?: string;
  name: string;
  slug: string;
  category_id: string | null;
  blurb: string | null;
  price: string | number | null;
  old_price: string | number | null;
  rating: string | number | null;
  reviews_count: number | string | null;
  verdict: string | null;
  main_image_url: string | null;
  main_image_alt: string | null;
  is_featured: boolean;
  is_best_pick: boolean;
  is_amazon_choice: boolean;
  quickSpecs?: Spec[];
  pros?: string[];
  cons?: string[];
};

function blankSpec(): Spec {
  return { label: "", value: "" };
}

function blankProduct(categoryId: string | null): ProductRecord {
  return {
    name: "",
    slug: "",
    category_id: categoryId,
    blurb: "",
    price: "",
    old_price: "",
    rating: "",
    reviews_count: "",
    verdict: "",
    main_image_url: "",
    main_image_alt: "",
    is_featured: false,
    is_best_pick: false,
    is_amazon_choice: false,
    quickSpecs: [blankSpec()],
    pros: [""],
    cons: [""],
  };
}

export function ProductForm({
  mode,
  categories,
  initialProduct,
}: {
  mode: "create" | "edit";
  categories: CategoryOption[];
  initialProduct?: ProductRecord | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductRecord>(initialProduct ?? blankProduct(categories[0]?.id ?? null));
  const [slugTouched, setSlugTouched] = useState(Boolean(initialProduct?.slug));
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>(initialProduct?.main_image_url ?? "");

  useEffect(() => {
    if (initialProduct) {
      setForm({
        ...blankProduct(initialProduct.category_id ?? categories[0]?.id ?? null),
        ...initialProduct,
        quickSpecs: initialProduct.quickSpecs?.length ? initialProduct.quickSpecs : [blankSpec()],
        pros: initialProduct.pros?.length ? initialProduct.pros : [""],
        cons: initialProduct.cons?.length ? initialProduct.cons : [""],
      });
      setPreviewUrl(initialProduct.main_image_url ?? "");
      setSlugTouched(Boolean(initialProduct.slug));
    }
  }, [categories, initialProduct]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === form.category_id),
    [categories, form.category_id],
  );

  function updateField<K extends keyof ProductRecord>(key: K, value: ProductRecord[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateSlugFromName(name: string) {
    if (!slugTouched) {
      updateField("slug", slugify(name));
    }
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

    const slug = slugify(form.slug || form.name || "product");
    const fileName = sanitizeFileName(file.name);
    const path = `products/${slug}/${fileName}`;

    setError("");
    setUploadProgress(10);
    setUploadMessage("Preparing upload...");

    const supabase = getBrowserSupabaseClient();
    const { error: uploadError } = await supabase.storage.from("images").upload(path, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "3600",
    });

    if (uploadError) {
      setUploadProgress(null);
      setUploadMessage("");
      setError(uploadError.message);
      return;
    }

    setUploadProgress(70);
    setUploadMessage("Creating public URL...");
    const { data } = supabase.storage.from("images").getPublicUrl(path);

    setForm((current) => ({ ...current, main_image_url: data.publicUrl, main_image_alt: current.name || current.slug }));
    setPreviewUrl(data.publicUrl);
    setUploadProgress(100);
    setUploadMessage("Upload complete.");
    window.setTimeout(() => {
      setUploadProgress(null);
      setUploadMessage("");
    }, 1200);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    await uploadImage(file);
  }

  async function saveRelatedRows(productId: string) {
    const supabase = getBrowserSupabaseClient();

    const quickSpecs = (form.quickSpecs ?? [])
      .filter((item) => item.label.trim() && item.value.trim())
      .map((item, index) => ({
        product_id: productId,
        label: item.label.trim(),
        value: item.value.trim(),
        sort_order: index,
      }));

    const pros = (form.pros ?? [])
      .map((item) => item.trim())
      .filter(Boolean)
      .map((content, index) => ({
        product_id: productId,
        type: "pro",
        content,
        sort_order: index,
      }));

    const cons = (form.cons ?? [])
      .map((item) => item.trim())
      .filter(Boolean)
      .map((content, index) => ({
        product_id: productId,
        type: "con",
        content,
        sort_order: index,
      }));

    await supabase.from("quick_specs").delete().eq("product_id", productId);
    await supabase.from("pros_cons").delete().eq("product_id", productId);

    if (quickSpecs.length > 0) {
      await supabase.from("quick_specs").insert(quickSpecs);
    }
    if (pros.length > 0) {
      await supabase.from("pros_cons").insert(pros);
    }
    if (cons.length > 0) {
      await supabase.from("pros_cons").insert(cons);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const supabase = getBrowserSupabaseClient();
    const payload = {
      category_id: form.category_id,
      name: form.name.trim(),
      slug: slugify(form.slug || form.name),
      blurb: form.blurb?.trim() || null,
      price: toNumberOrNull(String(form.price ?? "")),
      old_price: toNumberOrNull(String(form.old_price ?? "")),
      rating: toNumberOrNull(String(form.rating ?? "")),
      reviews_count: form.reviews_count === "" || form.reviews_count === null ? null : Number(form.reviews_count),
      verdict: form.verdict?.trim() || null,
      main_image_url: form.main_image_url?.trim() || null,
      main_image_alt: form.main_image_alt?.trim() || form.name.trim(),
      is_featured: form.is_featured,
      is_best_pick: form.is_best_pick,
      is_amazon_choice: form.is_amazon_choice,
      last_updated: new Date().toISOString(),
    };

    const productId = form.id;
    let savedId = productId ?? "";
    let saveError: string | null = null;

    if (productId) {
      const { error } = await supabase.from("products").update(payload).eq("id", productId);
      saveError = error?.message ?? null;
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select("id")
        .single();
      saveError = error?.message ?? null;
      savedId = data?.id ?? "";
    }

    if (saveError || !savedId) {
      setError(saveError ?? "Unable to save product.");
      setSaving(false);
      return;
    }

    await saveRelatedRows(savedId);
    setSaving(false);
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {mode === "create" ? "Add Product" : "Edit Product"}
          </h1>
          <p className="mt-1 text-sm text-white/55">
            {selectedCategory ? `Current category: ${selectedCategory.name}` : "Choose a category first."}
          </p>
        </div>
        <Button type="submit" className="bg-[#FF6B00] text-black hover:bg-[#ff7b1f]" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {saving ? "Saving..." : "Save Product"}
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {uploadProgress !== null ? (
        <div className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/35">
            <span>Image upload</span>
            <span>{uploadMessage}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-[#FF6B00] transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <Field label="Name">
            <Input
              value={form.name}
              onChange={(event) => {
                const value = event.target.value;
                updateField("name", value);
                updateSlugFromName(value);
              }}
              placeholder="Sony WH-1000XM5"
              className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
              required
            />
          </Field>

          <Field label="Slug">
            <Input
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true);
                updateField("slug", slugify(event.target.value));
              }}
              placeholder="sony-wh1000xm5"
              className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
              required
            />
          </Field>

          <Field label="Category">
            <select
              value={form.category_id ?? ""}
              onChange={(event) => updateField("category_id", event.target.value || null)}
              className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-white outline-none"
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Blurb">
            <textarea
              value={form.blurb ?? ""}
              onChange={(event) => updateField("blurb", event.target.value)}
              rows={4}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
              placeholder="Short summary for cards and review headers"
            />
          </Field>
        </div>

        <div className="space-y-5">
          <Field label="Image Upload">
            <div className="space-y-4 rounded-2xl border border-dashed border-white/15 bg-black/20 p-4">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="block w-full text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-[#FF6B00] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-[#ff7b1f]"
              />
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={form.name || "Product preview"}
                  className="aspect-video w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-xl border border-white/10 text-sm text-white/40">
                  No image selected
                </div>
              )}
              <p className="text-xs text-white/40">
                JPG, PNG, or WEBP only. Max file size: 5MB.
              </p>
              {form.main_image_url ? (
                <Input
                  value={form.main_image_url}
                  readOnly
                  className="border-white/10 bg-white/[0.02] text-white/70"
                />
              ) : null}
            </div>
          </Field>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Price">
          <Input
            value={String(form.price ?? "")}
            onChange={(event) => updateField("price", event.target.value)}
            placeholder="348.00"
            type="number"
            step="0.01"
            className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
          />
        </Field>
        <Field label="Old Price">
          <Input
            value={String(form.old_price ?? "")}
            onChange={(event) => updateField("old_price", event.target.value)}
            placeholder="399.99"
            type="number"
            step="0.01"
            className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
          />
        </Field>
        <Field label="Rating">
          <Input
            value={String(form.rating ?? "")}
            onChange={(event) => updateField("rating", event.target.value)}
            placeholder="4.9"
            type="number"
            min="0"
            max="5"
            step="0.1"
            className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Reviews Count">
          <Input
            value={String(form.reviews_count ?? "")}
            onChange={(event) => updateField("reviews_count", event.target.value)}
            placeholder="12400"
            type="number"
            className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
          />
        </Field>
        <Field label="Quick Toggles">
          <div className="flex flex-wrap gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white/75">
            <Toggle
              label="Featured"
              checked={form.is_featured}
              onChange={(checked) => updateField("is_featured", checked)}
            />
            <Toggle
              label="Best Pick"
              checked={form.is_best_pick}
              onChange={(checked) => updateField("is_best_pick", checked)}
            />
            <Toggle
              label="Amazon Choice"
              checked={form.is_amazon_choice}
              onChange={(checked) => updateField("is_amazon_choice", checked)}
            />
          </div>
        </Field>
      </div>

      <EditorBlock
        title="Pros"
        items={form.pros ?? []}
        onAdd={() => setForm((current) => ({ ...current, pros: [...(current.pros ?? []), ""] }))}
        onChange={(index, value) =>
          setForm((current) => {
            const next = [...(current.pros ?? [])];
            next[index] = value;
            return { ...current, pros: next };
          })
        }
        onRemove={(index) =>
          setForm((current) => ({ ...current, pros: (current.pros ?? []).filter((_, itemIndex) => itemIndex !== index) }))
        }
      />

      <EditorBlock
        title="Cons"
        items={form.cons ?? []}
        onAdd={() => setForm((current) => ({ ...current, cons: [...(current.cons ?? []), ""] }))}
        onChange={(index, value) =>
          setForm((current) => {
            const next = [...(current.cons ?? [])];
            next[index] = value;
            return { ...current, cons: next };
          })
        }
        onRemove={(index) =>
          setForm((current) => ({ ...current, cons: (current.cons ?? []).filter((_, itemIndex) => itemIndex !== index) }))
        }
      />

      <SpecEditor
        specs={form.quickSpecs ?? [blankSpec()]}
        onAdd={() => setForm((current) => ({ ...current, quickSpecs: [...(current.quickSpecs ?? []), blankSpec()] }))}
        onChange={(index, key, value) =>
          setForm((current) => {
            const next = [...(current.quickSpecs ?? [])];
            next[index] = { ...next[index], [key]: value };
            return { ...current, quickSpecs: next };
          })
        }
        onRemove={(index) =>
          setForm((current) => ({ ...current, quickSpecs: (current.quickSpecs ?? []).filter((_, itemIndex) => itemIndex !== index) }))
        }
      />

      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/55">
        <div>
          <span className="text-white">Public image URL:</span>{" "}
          {form.main_image_url ? "saved to Supabase Storage" : "set after upload"}
        </div>
        <div className="text-xs uppercase tracking-[0.22em] text-white/35">
          Slug preview: {form.slug || slugify(form.name)}
        </div>
      </div>
    </form>
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-white/20 bg-white/10"
      />
      <span>{label}</span>
    </label>
  );
}

function EditorBlock({
  title,
  items,
  onAdd,
  onChange,
  onRemove,
}: {
  title: string;
  items: string[];
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <Button type="button" variant="outline" className="border-white/10 bg-white/[0.03] text-white" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex gap-3">
            <Input
              value={item}
              onChange={(event) => onChange(index, event.target.value)}
              placeholder={`${title} item ${index + 1}`}
              className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
            />
            <Button
              type="button"
              variant="ghost"
              className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function SpecEditor({
  specs,
  onAdd,
  onChange,
  onRemove,
}: {
  specs: Spec[];
  onAdd: () => void;
  onChange: (index: number, key: keyof Spec, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Quick Specs</h2>
        <Button type="button" variant="outline" className="border-white/10 bg-white/[0.03] text-white" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add Spec
        </Button>
      </div>

      <div className="space-y-3">
        {specs.map((spec, index) => (
          <div key={`spec-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <Input
              value={spec.label}
              onChange={(event) => onChange(index, "label", event.target.value)}
              placeholder="Battery Life"
              className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
            />
            <Input
              value={spec.value}
              onChange={(event) => onChange(index, "value", event.target.value)}
              placeholder="30 Hours"
              className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30"
            />
            <Button
              type="button"
              variant="ghost"
              className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
