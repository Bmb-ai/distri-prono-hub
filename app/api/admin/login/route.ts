import { NextResponse } from "next/server";
import { isValidPassword, setAdminCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = String(body.password || "");

  if (!isValidPassword(password)) {
    return NextResponse.json({ error: "Mot de passe incorrect ou ADMIN_PASSWORD absent dans Vercel." }, { status: 401 });
  }

  setAdminCookie();
  return NextResponse.json({ ok: true });
}
