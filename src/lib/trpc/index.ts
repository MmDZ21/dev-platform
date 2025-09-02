import { router } from "./core";
import { categoryRouter } from "../../modules/blog/categoryRouter";
import { postRouter } from "../../modules/blog/postRouter";
import { tagRouter } from "../../modules/blog/tagRouter";
import { uploadRouter } from "./routers/uploadRouter";
import { productRouter } from "@/modules/products/productRouter";
import { productCategoryRouter } from "@/modules/products/productCategoryRouter";
import { productSpecRouter } from "@/modules/products/productSpecRouter";
import { searchRouter } from "@/modules/search";
import { leadRouter } from "@/modules/leads";
import { adminStatsRouter } from "./routers/adminStatsRouter";
import { generateModule } from "@/lib/cms/generateModule";
import { prisma } from "@/lib/db";
import { redirectMeta } from "@/modules/redirects/meta";

export const appRouter = router({
  post: postRouter,
  upload: uploadRouter,
  category: categoryRouter,
  tags: tagRouter,
  product: productRouter,
  productCategory: productCategoryRouter,
  productSpec: productSpecRouter,
  search: searchRouter,
  lead: leadRouter,
  redirect: generateModule(redirectMeta, prisma.redirect),
  adminStats: adminStatsRouter,
});

export type AppRouter = typeof appRouter;
