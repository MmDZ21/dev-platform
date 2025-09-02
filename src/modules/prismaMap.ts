import { prisma } from "@/lib/db";

export const modelPrismaMap = {
  posts: prisma.post, // ✅ add this
  categories: prisma.category,
  tags: prisma.tag,
  products:prisma.product,
  productsCategories: prisma.productCategory,
  productSpecs: prisma.productSpec,
  leads: prisma.lead,
  searchSynonyms: prisma.searchSynonym,
  redirects: prisma.redirect,
} as const;

export type PrismaModelKey = keyof typeof modelPrismaMap;
