import { initTRPC } from "@trpc/server";
import superjson from "superjson";

// Ensure this module is only evaluated on the server
if (typeof window !== 'undefined') {
  throw new Error("tRPC server core imported on the client");
}

const t = initTRPC.create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
