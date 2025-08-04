import { defineAdminModel } from "@/lib/admin/meta";
import { Package2Icon } from "lucide-react"; // فرضاً برای محصول

export const productMeta = defineAdminModel({
  name: "محصولات",
  icon: Package2Icon,
  parent: "products",
  fields: {
    name: { type: "text", label: "نام محصول", required: true },
    slug: { type: "text", label: "اسلاگ", required: true },
    summary: { type: "text", label: "خلاصه" },
    description: { type: "richText", label: "توضیحات کامل" },
    imageUrls: {
      type: "multi-image",
      label: "گالری تصاویر",
      required: false,
    },
    datasheetUrl: { type: "file", label: "دیتاشیت/کاتالوگ (PDF)" },
    categoryId: {
      type: "select",
      label: "دسته‌بندی",
      options: "productCategory",
      required: true,
    },
    tags: {
      type: "multi-select",
      label: "تگ‌ها",
      required: false,
    },
    isPublished: { type: "boolean", label: "منتشر شده" },
    order: { type: "number", label: "ترتیب نمایش" },

    // ----- SEO & Meta Fields -----
    metaTitle: { type: "text", label: "عنوان متا" },
    metaDescription: { type: "text", label: "توضیحات متا" },
    canonicalUrl: { type: "text", label: "Canonical URL" },
    ogTitle: { type: "text", label: "OpenGraph عنوان" },
    ogDescription: { type: "text", label: "OpenGraph توضیحات" },
    ogImage: { type: "image", label: "OpenGraph تصویر" },

    // (اختیاری: اگر خواستی structured data رو future proof بذاریم)
    // jsonLd: { type: "code", label: "JSON-LD Schema", language: "json", required: false },
  },
});
