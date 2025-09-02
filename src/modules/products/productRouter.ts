import { z } from 'zod';
import { router, publicProcedure } from '@/lib/trpc/core';
import { prisma } from '@/lib/db';
import { productMeta } from './productMeta';
import { generateModule } from '@/lib/cms/generateModule';

// Base CRUD from meta
const base = generateModule(productMeta, prisma.product);

// CSV/Excel bulk upsert schema (simplified; expects array of rows)
const csvRowSchema = z.object({
  sku: z.string(),
  slug: z.string().optional(),
  name: z.string().optional(),
  title: z.string().optional(),
  shortDesc: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  datasheets: z.array(z.string()).optional(),
  brand: z.string().optional(),
  series: z.string().optional(),
  warrantyMonths: z.coerce.number().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const productRouter = router({
  ...base._def.procedures, // expose CRUD

  bulkUpsert: publicProcedure
    .input(z.object({ rows: z.array(csvRowSchema) }))
    .mutation(async ({ input }) => {
      const results: { sku: string; id: string }[] = [];
      for (const row of input.rows) {
        const connect: any = {};
        if (row.categoryId) connect.category = { connect: { id: row.categoryId } };
        const tagConnect = row.tags?.length ? { tags: { set: row.tags.map((id) => ({ id })) } } : {};
        const data = {
          slug: row.slug ?? row.sku.toLowerCase(),
          name: row.name ?? row.title ?? row.sku,
          title: row.title ?? null,
          shortDesc: row.shortDesc ?? null,
          summary: row.summary ?? null,
          description: row.description ?? null,
          images: row.images ?? [],
          datasheets: row.datasheets ?? [],
          brand: row.brand ?? null,
          series: row.series ?? null,
          warrantyMonths: row.warrantyMonths ?? null,
          isActive: row.isActive ?? true,
          ...connect,
          ...tagConnect,
        } as any;

        const upserted = await prisma.product.upsert({
          where: { sku: row.sku },
          update: data,
          create: { sku: row.sku, ...data, userId: "system" },
        });
        results.push({ sku: row.sku, id: upserted.id });
      }
      return { count: results.length, results };
    }),
});