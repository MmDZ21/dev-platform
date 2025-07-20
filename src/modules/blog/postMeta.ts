import { defineAdminModel } from "@/lib/admin/meta";
import { TextIcon } from "lucide-react";

export const postMeta = defineAdminModel({
  name: "پست‌ها",
  icon: TextIcon,
    parent: "blog",
  fields: {
    title: { type: "text", label: "عنوان", required: true },
    slug: { type: "text", label: "اسلاگ", required: true },
    content: {
      type: "richText",
      label: "محتوا",
    },
    summary: { type: "text", label: "خلاصه" },

    draft: { type: "boolean", label: "پیش‌نویس؟" },

    published: { type: "boolean", label: "منتشر شده" },
    imageUrl: {
      type: "image",
      label: "تصویر",
    },
    categoryId: {
      type: "select",
      label: "دسته‌بندی",
      required: false,
      // options is no longer needed here—fetched dynamically in the component
    },
    tags: {
      type: "multi-select",
      label: "تگ‌ها",
      required: false,
    },
    metaTitle: { type: "text", label: "عنوان متا" },
    metaDescription: { type: "text", label: "توضیحات متا" },
    canonicalUrl: { type: "text", label: "Canonical URL" },
    ogImage: { type: "image", label: "OpenGraph تصویر" },
  },
});
