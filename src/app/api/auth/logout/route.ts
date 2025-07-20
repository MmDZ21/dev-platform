import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const sessionCookie = (await cookies()).get("auth_session");
  if (!sessionCookie) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { session } = await lucia.validateSession(sessionCookie.value);
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  await lucia.invalidateSession(session.id);
  const emptyCookie = lucia.createBlankSessionCookie();

  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", emptyCookie.serialize());
  return response;
}
