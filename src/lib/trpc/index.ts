import { router } from "./core";
import { categoryRouter } from "../../modules/blog/categoryRouter";
import { postRouter } from "../../modules/blog/postRouter";
import { tagRouter } from "../../modules/blog/tagRouter";
import { uploadRouter } from "./routers/uploadRouter";
import { productRouter } from "@/modules/products/productRouter";
import { productCategoryRouter } from "@/modules/products/productCategoryRouter";
import { adminStatsRouter } from "./routers/adminStatsRouter";

export const appRouter = router({
  post: postRouter,
  upload: uploadRouter,
  category: categoryRouter,
  tags: tagRouter,
  product: productRouter,
  productCategory: productCategoryRouter,
  adminStats: adminStatsRouter,
});

export type AppRouter = typeof appRouter;
