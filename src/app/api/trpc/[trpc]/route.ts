import { appRouter } from "@/lib/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      const sessionId = (await cookies()).get("auth_session")?.value ?? null;
      if (!sessionId) return { user: null as any };
      const { user } = await lucia.validateSession(sessionId);
      return { user } as any;
    },
  });
};

export { handler as GET, handler as POST };