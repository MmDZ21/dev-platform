import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";

const handler = async (req: Request) => {
  const { appRouter } = await import("@/lib/trpc");
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      const sessionId = (await cookies()).get("auth_session")?.value ?? null;
      const { user } = sessionId ? await lucia.validateSession(sessionId) : { user: null } as any;
      const xf = req.headers.get('x-forwarded-for') || '';
      const ip = (xf.split(',')[0] || req.headers.get('x-real-ip') || '').trim() || undefined;
      const userAgent = req.headers.get('user-agent') || undefined;
      return { user, ip, userAgent } as any;
    },
    onError({ error, path, type }) {
      console.error("tRPC error", { path, type, message: error.message, cause: (error as any)?.cause });
    },
  });
};

export { handler as GET, handler as POST };