import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia } from "@/lib/auth"; // اگر مسیر شما فرق دارد، همین را اصلاح کن

export async function validateRequest() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return { user: null, session: null };

  const { user, session } = await lucia.validateSession(sessionId);
  // اینجا اگر role/name/email توی مدل‌تون هست، map کن
  return { user, session };
}

export async function requireAuth(opts?: { loginPath?: string }) {
  const { user } = await validateRequest();
  if (!user) redirect(opts?.loginPath ?? "/login"); // اگر لاگین ادمین داری: "/admin/login"
  return user;
}
