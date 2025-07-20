import { defineAdminModel } from "@/lib/admin/meta";
import { FolderIcon } from "lucide-react";

export const productCategoryMeta = defineAdminModel({
  name: "دسته‌بندی محصولات",
  icon: FolderIcon,
  parent: "products",
  fields: {
    name: { type: "text", label: "نام دسته‌بندی", required: true },
    slug: { type: "text", label: "اسلاگ", required: true },
    parentId: {
      type: "select",
      label: "دسته‌بندی والد",
      required: false,
      // options: ... (دینامیک)
    },
    summary: { type: "text", label: "خلاصه", required: false },
    description: { type: "richText", label: "توضیحات کامل", required: false },
    image: { type: "image", label: "تصویر دسته‌بندی", required: false },
    order: { type: "number", label: "ترتیب نمایش", required: false },

    // ------- SEO & Meta Fields -------
    metaTitle: { type: "text", label: "عنوان متا" },
    metaDescription: { type: "text", label: "توضیحات متا" },
    ogImage: { type: "image", label: "تصویر OG" },
  },
});
