import { prisma } from "@/lib/db";
import { lucia } from "@/lib/auth";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.hashedPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const isValid = await compare(password, user.hashedPassword);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", sessionCookie.serialize());
  return response;
}
