// src/modules/registry.ts

import { postMeta } from "./blog";
import { tagMeta } from "./blog";
import { categoryMeta } from "./blog";
import { productCategoryMeta, productMeta, productSpecMeta } from "./products";
import { searchSynonymMeta } from "./search/meta";
import { leadMeta } from "./leads/meta";
import { redirectMeta } from "./redirects";
import { Pen as PenIcon, Store as StoreIcon, Search as SearchIcon, Inbox as InboxIcon } from "lucide-react";

// مدل‌هایی که full CRUD دارن
export const adminModelRegistry = {
  post: postMeta,
  category: categoryMeta,
  tag: tagMeta,
  product: productMeta,
  productCategory: productCategoryMeta,
  productSpec: productSpecMeta,
  searchSynonym: searchSynonymMeta,
  lead: leadMeta,
  redirect: redirectMeta
  // هر مدل ادمینی دیگه
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
  {
    key: "leads",
    name: "درخواست‌ها",
    icon: InboxIcon,
    children: ["lead"],
  },
  {
    key: "seo",
    name: "SEO",
    icon: SearchIcon,
    children: ["redirect", "searchSynonym"],
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
