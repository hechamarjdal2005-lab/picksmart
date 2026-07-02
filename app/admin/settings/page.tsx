"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBrowserSupabaseClient } from "@/lib/supabase-admin";

export default function AdminSettingsPage() {
  const supabase = getBrowserSupabaseClient();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data } = await supabase
      .from("site_settings")
      .select("logo_url")
      .eq("id", 1)
      .maybeSingle();

    if (data?.logo_url) {
      setLogoUrl(data.logo_url);
      setPreviewUrl(data.logo_url);
    }
  }

  async function uploadLogo(file: File) {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError("Only JPG, PNG, and WEBP files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    setError("");
    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    const fileName = `logo-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const path = `site/logo/${fileName}`;

    const { error: uploadError } = await supabase.storage.from("images").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

    if (uploadError) {
      setPreviewUrl(logoUrl);
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(path);

    const { error: saveError } = await supabase.from("site_settings").upsert(
      { id: 1, logo_url: publicUrl },
    );

    if (saveError) {
      setError(saveError.message);
      setPreviewUrl(logoUrl);
    } else {
      setLogoUrl(publicUrl);
      fetch("/api/revalidate", { method: "POST", body: JSON.stringify({ path: "/" }) });
    }

    setUploading(false);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadLogo(file);
  }

  async function removeLogo() {
    setSaving(true);
    setError("");

    const { error: saveError } = await supabase.from("site_settings").upsert(
      { id: 1, logo_url: null },
    );

    if (saveError) {
      setError(saveError.message);
    } else {
      setLogoUrl(null);
      setPreviewUrl(null);
      fetch("/api/revalidate", { method: "POST", body: JSON.stringify({ path: "/" }) });
    }

    setSaving(false);
  }

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-2 text-sm text-white/55">
          Manage branding and site-wide configuration.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
        <h2 className="text-lg font-semibold text-white">Site Logo</h2>

        <div className="space-y-4">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-[#FF6B00] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-[#ff7b1f] disabled:opacity-50"
          />

          <div className="flex items-start gap-4">
            {previewUrl ? (
              <div className="relative aspect-video w-48 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                <img
                  src={previewUrl}
                  alt="Site logo preview"
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex aspect-video w-48 items-center justify-center rounded-xl border border-dashed border-white/15 text-sm text-white/40">
                No logo
              </div>
            )}

            <div className="flex flex-col gap-2">
              {logoUrl ? (
                <>
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                    <div className="text-xs uppercase tracking-[0.22em] text-white/35">
                      Current URL
                    </div>
                    <div className="mt-1 break-all text-xs text-white/60">
                      {logoUrl}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-fit text-red-300 hover:bg-red-500/10 hover:text-red-200"
                    onClick={removeLogo}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Remove logo
                  </Button>
                </>
              ) : null}
            </div>
          </div>

          <p className="text-xs text-white/40">
            JPG, PNG, or WEBP only. Max 5MB. Uploaded to the existing images storage bucket.
          </p>
        </div>
      </div>
    </section>
  );
}
