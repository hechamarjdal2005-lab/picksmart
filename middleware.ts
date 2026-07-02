import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const ADMIN_ACCESS_COOKIE = "picksmart-admin-access-token";

function isLoginRoute(pathname: string) {
  return pathname === "/admin/login";
}

function buildRedirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (isLoginRoute(pathname)) {
    const accessToken = request.cookies.get(ADMIN_ACCESS_COOKIE)?.value;
    if (!accessToken || !supabaseUrl || !supabaseAnonKey) {
      return NextResponse.next();
    }

    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
    const { data, error } = await client.auth.getUser(accessToken);
    if (!error && data.user) {
      return buildRedirect(request, "/admin/dashboard");
    }

    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken || !supabaseUrl || !supabaseAnonKey) {
    return buildRedirect(request, "/admin/login");
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data.user) {
    return buildRedirect(request, "/admin/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
