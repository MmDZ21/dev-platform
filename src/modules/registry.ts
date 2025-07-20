// src/modules/registry.ts

import { trpc } from "@/lib/trpc/client";
import { postMeta } from "./blog";
import { tagMeta } from "./blog";
import { categoryMeta } from "./blog";
import { blogMeta } from "./blog/meta";
import { productCategoryMeta, productMeta } from "./products";
import { productsMeta } from "./products/meta";

// مدل‌هایی که full CRUD دارن
export const adminModelRegistry = {
  blog: blogMeta,
  post: postMeta,
  category: categoryMeta,
  tag: tagMeta,
  product: productMeta,
  products: productsMeta,
  productCategory: productCategoryMeta
  // هر مدل ادمینی دیگه
} as const;

export const adminModelRouterMap = {
  post: trpc.post,
  category: trpc.categories,
  tag: trpc.tags,
  product: trpc.product,
  productCategory: trpc.productCategory
  // ...
} as const;

// مدل‌های option/select فقط getAll دارن (readonly)
// export const optionModelRegistry = {
//   // ...
// } as const;

// export const optionModelRouterMap = {
//   // ...
// } as const;

export type AdminModelKey = keyof typeof adminModelRegistry;
// export type OptionModelKey = keyof typeof optionModelRegistry;
