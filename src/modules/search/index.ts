import { z } from "zod";
import { router, publicProcedure } from "@/lib/trpc/core";
import { prisma } from "@/lib/db";

// Normalization: fa/en digits and variants
export function normalizeText(input: string): string {
  const map: Record<string, string> = {
    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
    "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
    "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
    "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
    "ك": "ک", "ي": "ی", "ة": "ه",
  };
  return input.replace(/[۰-۹٠-٩كيۍة]/g, (ch) => map[ch] ?? ch).toLowerCase().trim();
}

async function expandSynonyms(q: string): Promise<string[]> {
  const norm = normalizeText(q);
  const synonym = await prisma.searchSynonym.findFirst({ where: { term: norm } });
  return [norm, ...(synonym?.synonyms ?? [])];
}

export const searchRouter = router({
  query: publicProcedure
    .input(z.object({ q: z.string().min(1), categoryId: z.string().optional() }))
    .query(async ({ input }) => {
      const terms = await expandSynonyms(input.q);
      const where = {
        AND: [
          input.categoryId ? { categoryId: input.categoryId } : {},
          { isActive: true },
          {
            OR: [
              { sku: { in: terms } },
              { name: { contains: input.q, mode: "insensitive" } },
              { title: { contains: input.q, mode: "insensitive" } },
              { summary: { contains: input.q, mode: "insensitive" } },
              { description: { contains: input.q, mode: "insensitive" } },
            ],
          },
        ],
      } as any;

      const [items, facets] = await Promise.all([
        prisma.product.findMany({ where, select: { id: true, slug: true, sku: true, name: true, title: true, imageUrls: true, images: true, categoryId: true } }),
        prisma.product.groupBy({ by: ["categoryId"], where, _count: { _all: true } }),
      ]);

      return { items, facets };
    }),

  synonyms: router({
    getAll: publicProcedure.query(async () => {
      const rows = await prisma.searchSynonym.findMany();
      return rows.map((r) => ({ ...r, synonymsText: (r.synonyms || []).join(", ") } as any));
    }),
    getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      const r = await prisma.searchSynonym.findUnique({ where: { id: input.id } });
      if (!r) return null as any;
      return { ...r, synonymsText: (r.synonyms || []).join(", ") } as any;
    }),
    create: publicProcedure
      .input(z.object({ term: z.string(), synonymsText: z.string().optional(), locale: z.string().optional() }))
      .mutation(({ input }) => {
        const synonyms = (input.synonymsText || "")
          .split(',')
          .map((s) => normalizeText(s.trim()))
          .filter(Boolean);
        return prisma.searchSynonym.create({
          data: { term: normalizeText(input.term), synonyms, locale: input.locale ?? null },
        });
      }),
    update: publicProcedure
      .input(z.object({ id: z.string(), term: z.string().optional(), synonymsText: z.string().optional(), locale: z.string().optional() }))
      .mutation(({ input }) => {
        const synonyms = (input.synonymsText || "")
          .split(',')
          .map((s) => normalizeText(s.trim()))
          .filter(Boolean);
        return prisma.searchSynonym.update({
          where: { id: input.id },
          data: {
            term: input.term ? normalizeText(input.term) : undefined,
            synonyms,
            locale: input.locale ?? undefined,
          },
        });
      }),
    delete: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => prisma.searchSynonym.delete({ where: { id: input.id } })),
  }),
});


