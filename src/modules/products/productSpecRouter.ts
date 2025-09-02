import { z } from 'zod';
import { generateModule } from '@/lib/cms/generateModule';
import { prisma } from '@/lib/db';
import { productSpecMeta } from './productSpecMeta';
import { router, publicProcedure } from '@/lib/trpc/core';

const base = generateModule(productSpecMeta, prisma.productSpec);

export const productSpecRouter = router({
  ...base._def.procedures,
  getByProduct: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(({ input }) =>
      prisma.productSpec.findMany({ where: { productId: input.productId }, orderBy: { order: 'asc' } })
    ),
});


