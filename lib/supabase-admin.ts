import { createClient, type SupabaseClient, type Session, type User } from "@supabase/supabase-js";
import type { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const ACCESS_TOKEN_COOKIE = "picksmart-admin-access-token";
export const REFRESH_TOKEN_COOKIE = "picksmart-admin-refresh-token";
export const EMAIL_COOKIE = "picksmart-admin-email";
export const EXPIRES_AT_COOKIE = "picksmart-admin-expires-at";

type CookieStore = {
  get(name: string): { value: string } | undefined;
  set(name: string, value: string, options?: Record<string, unknown>): void;
  delete(name: string): void;
};

type AdminSession = {
  accessToken: string;
  refreshToken: string;
  email: string;
  expiresAt: number;
  user: Pick<User, "id" | "email">;
};

let browserClient: SupabaseClient | null = null;
let serviceClient: SupabaseClient | null = null;

function requireSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
}

export function getBrowserSupabaseClient() {
  requireSupabaseConfig();

  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}

export function getServiceSupabaseClient() {
  requireSupabaseConfig();

  if (typeof window !== "undefined") {
    throw new Error("getServiceSupabaseClient can only run on the server.");
  }

  if (!serviceClient) {
    if (!supabaseServiceRoleKey) {
      console.warn(
        "[supabase-admin] SUPABASE_SERVICE_ROLE_KEY missing; falling back to anon server client.",
      );
    }

    serviceClient = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return serviceClient;
}

async function readCookieStore(): Promise<CookieStore | null> {
  if (typeof window !== "undefined") return null;
  const { cookies } = await import("next/headers");
  return cookies() as CookieStore;
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export async function persistAdminSession(session: Session) {
  const cookieStore = await readCookieStore();
  if (!cookieStore) return;

  const opts = cookieOptions();
  const maxAge = session.expires_at
    ? Math.max(session.expires_at - Math.floor(Date.now() / 1000), 0)
    : undefined;

  cookieStore.set(ACCESS_TOKEN_COOKIE, session.access_token, { ...opts, maxAge });
  cookieStore.set(REFRESH_TOKEN_COOKIE, session.refresh_token ?? "", { ...opts, maxAge: 60 * 60 * 24 * 30 });
  cookieStore.set(EMAIL_COOKIE, session.user?.email ?? "", opts);
  cookieStore.set(EXPIRES_AT_COOKIE, String(session.expires_at ?? 0), opts);
}

export function setAdminSessionCookies(
  response: NextResponse,
  session: Session,
) {
  const opts = cookieOptions();
  const maxAge = session.expires_at
    ? Math.max(session.expires_at - Math.floor(Date.now() / 1000), 0)
    : undefined;

  response.cookies.set(ACCESS_TOKEN_COOKIE, session.access_token, { ...opts, maxAge });
  response.cookies.set(REFRESH_TOKEN_COOKIE, session.refresh_token ?? "", { ...opts, maxAge: 60 * 60 * 24 * 30 });
  response.cookies.set(EMAIL_COOKIE, session.user?.email ?? "", opts);
  response.cookies.set(EXPIRES_AT_COOKIE, String(session.expires_at ?? 0), opts);
}

function deleteOptions() {
  return {
    ...cookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  };
}

export async function clearAdminSession() {
  const cookieStore = await readCookieStore();
  if (!cookieStore) return;

  const opts = deleteOptions();
  cookieStore.set(ACCESS_TOKEN_COOKIE, "", opts);
  cookieStore.set(REFRESH_TOKEN_COOKIE, "", opts);
  cookieStore.set(EMAIL_COOKIE, "", opts);
  cookieStore.set(EXPIRES_AT_COOKIE, "", opts);
}

export function clearAdminSessionCookies(response: NextResponse) {
  const opts = deleteOptions();
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", opts);
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", opts);
  response.cookies.set(EMAIL_COOKIE, "", opts);
  response.cookies.set(EXPIRES_AT_COOKIE, "", opts);
}

export async function getSession() {
  const cookieStore = await readCookieStore();
  const accessToken = cookieStore?.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore?.get(REFRESH_TOKEN_COOKIE)?.value;
  const email = cookieStore?.get(EMAIL_COOKIE)?.value ?? "";
  const expiresAtValue = cookieStore?.get(EXPIRES_AT_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  const client = createClient(supabaseUrl || "http://localhost:54321", supabaseAnonKey || "public-anon-key", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data.user) {
    return null;
  }

  return {
    accessToken,
    refreshToken: refreshToken ?? "",
    email: data.user.email ?? email,
    expiresAt: Number(expiresAtValue ?? 0),
    user: {
      id: data.user.id,
      email: data.user.email ?? email,
    },
  } satisfies AdminSession;
}

export async function signOut() {
  if (typeof window !== "undefined") {
    const client = getBrowserSupabaseClient();
    await client.auth.signOut();
    await fetch("/api/admin/session", { method: "DELETE" });
    return;
  }

  const cookieStore = await readCookieStore();
  if (!cookieStore) return;

  const opts = deleteOptions();
  cookieStore.set(ACCESS_TOKEN_COOKIE, "", opts);
  cookieStore.set(REFRESH_TOKEN_COOKIE, "", opts);
  cookieStore.set(EMAIL_COOKIE, "", opts);
  cookieStore.set(EXPIRES_AT_COOKIE, "", opts);
}

export function getAdminEmail(session: Awaited<ReturnType<typeof getSession>>) {
  return session?.email ?? session?.user.email ?? "";
}

export type { AdminSession };
