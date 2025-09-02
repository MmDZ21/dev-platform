import { defineAdminModel } from "@/lib/admin/meta";
import { Package2Icon } from "lucide-react"; // فرضاً برای محصول

export const productMeta = defineAdminModel({
  name: "محصولات",
  icon: Package2Icon,
  parent: "products",
  fields: {
    name: { type: "text", label: "نام محصول", required: true },
    slug: { type: "text", label: "اسلاگ", required: true },
    sku: { type: "text", label: "کد SKU" },
    title: { type: "text", label: "عنوان" },
    summary: { type: "text", label: "خلاصه" },
    shortDesc: { type: "text", label: "توضیح کوتاه" },
    description: { type: "richText", label: "توضیحات کامل" },
    imageUrls: {
      type: "multi-image",
      label: "گالری تصاویر",
      required: false,
    },
    images: { type: "multi-image", label: "تصاویر" },
    datasheetUrl: { type: "file", label: "دیتاشیت/کاتالوگ (PDF)" },
    datasheets: { type: "multi-image", label: "فایل‌های دیتاشیت" },
    brand: { type: "text", label: "برند" },
    series: { type: "text", label: "سری" },
    warrantyMonths: { type: "number", label: "گارانتی (ماه)" },
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
    isActive: { type: "boolean", label: "فعال" },
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
