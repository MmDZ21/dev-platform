import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const allCookies = cookies(); // Next.js headers helper
  const sessionCookie = (await allCookies).get("auth_session");

  if (!sessionCookie) {
    return NextResponse.json({ error: "No cookie", user: null }, { status: 401 });
  }

  const { user, session } = await lucia.validateSession(sessionCookie.value);
console.log("Lucia user object:", user);
  if (!session || !user) {
    return NextResponse.json({ error: "Invalid session", user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
