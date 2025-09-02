import { defineAdminModel } from "@/lib/admin/meta";
import { LinkIcon } from "lucide-react";

export const searchSynonymMeta = defineAdminModel({
  name: "مترادف‌های جستجو",
  icon: LinkIcon,
  fields: {
    term: { type: "text", label: "عبارت پایه", required: true },
    synonymsText: { type: "text", label: "مترادف‌ها (با کاما جدا کنید)", required: false },
    locale: { type: "text", label: "locale" },
  },
});


