// src/lib/auth.ts
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export const lucia = new Lucia(new PrismaAdapter(prisma.session, prisma.user), {
  sessionCookie: {
    name: "auth_session",
    expires: false, // session cookie
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (user: any) => {
console.log("Lucia user in getUserAttributes:", user)

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  },
});

// Optional: Attach Lucia types globally (for type inference)
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: string;
      email: string;
      username: string | null;
      role: "admin" | "user";
    };
  }
}
