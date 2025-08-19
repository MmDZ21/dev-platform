// src/modules/registry.ts

import { trpc } from "@/lib/trpc/client";
import { postMeta } from "./blog";
import { tagMeta } from "./blog";
import { categoryMeta } from "./blog";
import { productCategoryMeta, productMeta } from "./products";
import { PenIcon, StoreIcon } from "lucide-react";

// مدل‌هایی که full CRUD دارن
export const adminModelRegistry = {
  post: postMeta,
  category: categoryMeta,
  tag: tagMeta,
  product: productMeta,
  productCategory: productCategoryMeta
  // هر مدل ادمینی دیگه
} as const;

export const adminModelRouterMap = {
  post: trpc.post,
  category: trpc.category,
  tag: trpc.tags,
  product: trpc.product,
  productCategory: trpc.productCategory
  // ...
} as const;

export const adminMenuGroups = [
    {
    key: "blog",
    name: "بلاگ",
    icon: PenIcon,
    children: ["post", "category", "tag"],
  },
  {
    key: "products",
    name: "محصولات",
    icon: StoreIcon,
    children: ["product", "productCategory"],
  },
]
// مدل‌های option/select فقط getAll دارن (readonly)
// export const optionModelRegistry = {
//   // ...
// } as const;

// export const optionModelRouterMap = {
//   // ...
// } as const;

export type AdminModelKey = keyof typeof adminModelRegistry;
// export type OptionModelKey = keyof typeof optionModelRegistry;
