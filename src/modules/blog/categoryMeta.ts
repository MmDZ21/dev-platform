import { defineAdminModel } from "@/lib/admin/meta";
import { GridIcon } from "lucide-react";

export const categoryMeta = defineAdminModel({
  name: "دسته‌بندی‌ها",
  parent: "blog",
  icon: GridIcon,
  fields: {
    name: { type: "text", label: "نام دسته‌بندی", required: true },
    slug: { type: "text", label: "اسلاگ", required: true },
    // --- SEO
    metaTitle: { type: "text", label: "عنوان متا" },
    metaDescription: { type: "text", label: "توضیحات متا" },
    image: { type: "image", label: "تصویر OG", required: false }, // اختیاری و مفید برای سئو شبکه‌های اجتماعی
  },
});