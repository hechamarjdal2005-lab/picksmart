import { NextResponse } from "next/server";
import { clearAdminSessionCookies, setAdminSessionCookies } from "@/lib/supabase-admin";
import type { Session } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const payload = (await request.json()) as { session?: Session };

  if (!payload.session?.access_token) {
    return NextResponse.json({ error: "Missing session" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  setAdminSessionCookies(response, payload.session);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearAdminSessionCookies(response);
  return response;
}
