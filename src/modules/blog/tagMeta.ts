import { defineAdminModel } from "@/lib/admin/meta";
import { TagIcon } from "lucide-react";

export const tagMeta = defineAdminModel({
  name: "تگ‌ها",
  parent: "blog",
  icon: TagIcon,
  fields: {
    name: { type: "text", label: "نام تگ", required: true },
    slug: { type: "text", label: "اسلاگ", required: true },
    // --- SEO
    metaTitle: { type: "text", label: "عنوان متا" },
    metaDescription: { type: "text", label: "توضیحات متا" },
  },
});