import { defineAdminModel } from "@/lib/admin/meta";
import { ListOrderedIcon } from "lucide-react";

export const productSpecMeta = defineAdminModel({
  name: "مشخصات محصول",
  icon: ListOrderedIcon,
  parent: "products",
  fields: {
    productId: { type: "select", label: "محصول", options: "product", required: true },
    key: { type: "text", label: "کلید", required: true },
    value: { type: "text", label: "مقدار", required: true },
    unit: { type: "text", label: "واحد" },
    order: { type: "number", label: "ترتیب" },
  },
});


