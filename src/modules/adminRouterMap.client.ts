'use client';

import { trpc } from '@/lib/trpc/client';

export const adminModelRouterMap = {
  post: trpc.post,
  category: trpc.category,
  tag: trpc.tags,
  product: trpc.product,
  productCategory: trpc.productCategory,
  productSpec: trpc.productSpec,
  searchSynonym: trpc.search.synonyms,
  lead: trpc.lead,
  redirect: trpc.redirect,
} as const;

export type AdminModelRouterMap = typeof adminModelRouterMap;


