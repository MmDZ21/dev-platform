import { router } from "./core";
import { categoryRouter } from "../../modules/blog/categoryRouter";
import { postRouter } from "../../modules/blog/postRouter";
import { tagRouter } from "../../modules/blog/tagRouter";
import { uploadRouter } from "./routers/uploadRouter";
import { productRouter } from "@/modules/products/productRouter";
import { productCategoryRouter } from "@/modules/products/productCategoryRouter";

export const appRouter = router({
  post: postRouter, // ✅ add this
  upload: uploadRouter, // ✅ Add this
  categories: categoryRouter,
  tags: tagRouter,
  product: productRouter,
  productCategory: productCategoryRouter,
});

export type AppRouter = typeof appRouter;
