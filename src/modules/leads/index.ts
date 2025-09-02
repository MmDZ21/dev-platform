import { z } from "zod";
import { router, publicProcedure } from "@/lib/trpc/core";
import { prisma } from "@/lib/db";
import { generateModule } from "@/lib/cms/generateModule";
import { leadMeta } from "./meta";

// Simple in-memory rate limiter (per IP). Replace with Redis in prod.
const rateMap = new Map<string, { count: number; ts: number }>();
function rateLimit(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const rec = rateMap.get(ip) || { count: 0, ts: now };
  if (now - rec.ts > windowMs) {
    rec.count = 0; rec.ts = now;
  }
  rec.count += 1;
  rateMap.set(ip, rec);
  return rec.count <= limit;
}

const base = generateModule(leadMeta, prisma.lead);

export const leadRouter = router({
  ...base._def.procedures, // getAll, getById, create, update, delete

  createPublic: publicProcedure
    .input(z.object({
      name: z.string().min(2),
      phone: z.string().min(5),
      email: z.string().email().optional(),
      message: z.string().optional(),
      productId: z.string().optional(),
      utm: z.record(z.any()).optional(),
      honeypot: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (input.honeypot) return { ok: true };
      const ip = (ctx as any)?.ip || "anon";
      if (!rateLimit(ip)) throw new Error("Too many requests");

      const lead = await prisma.lead.create({
        data: {
          name: input.name,
          phone: input.phone,
          email: input.email ?? null,
          message: input.message ?? null,
          productId: input.productId ?? null,
          utm: input.utm as any,
          ip,
          userAgent: (ctx as any)?.userAgent ?? null,
        },
      });
      return { ok: true, id: lead.id };
    }),
});


