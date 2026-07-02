"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBrowserSupabaseClient } from "@/lib/supabase-admin";

async function syncAdminSession() {
  const supabase = getBrowserSupabaseClient();
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;

  await fetch("/api/admin/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session: data.session }),
  });

  return data.session;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    syncAdminSession()
      .then((session) => {
        if (active && session) {
          router.replace("/admin/dashboard");
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = getBrowserSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const session = await syncAdminSession();
    if (!session) {
      setError("Signed in, but session could not be persisted.");
      setLoading(false);
      return;
    }

    router.replace("/admin/dashboard");
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#0A0A0F] px-4 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-black/40">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-4 py-2 text-sm font-semibold text-[#FFB27A]">
            <Sparkles className="h-4 w-4" />
            PickSmart Admin
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Secure admin access for the editorial team.
            </h1>
            <p className="max-w-xl text-sm leading-6 text-white/65">
              Sign in with the admin account created in Supabase. No public registration,
              no self-serve onboarding, and no unnecessary surface area.
            </p>
          </div>
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/70 sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-white/40">Theme</div>
              <div className="mt-1 text-white">Dark control panel</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-white/40">Accent</div>
              <div className="mt-1 text-[#FF6B00]">#FF6B00</div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#12131A] p-8 shadow-2xl shadow-black/40">
          <h2 className="text-2xl font-semibold text-white">Admin sign in</h2>
          <p className="mt-2 text-sm text-white/55">Use your Supabase admin credentials.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-white/35" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="border-white/10 bg-white/[0.03] pl-10 text-white placeholder:text-white/30"
                  placeholder="admin@picksmart.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-white/35" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="border-white/10 bg-white/[0.03] pl-10 text-white placeholder:text-white/30"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-[#FF6B00] text-black hover:bg-[#ff7b1f]"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
