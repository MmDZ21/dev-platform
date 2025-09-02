import { defineAdminModel } from "@/lib/admin/meta";
import { PhoneCallIcon } from "lucide-react";

export const leadMeta = defineAdminModel({
  name: "سرنخ‌ها",
  icon: PhoneCallIcon,
  fields: {
    name: { type: "text", label: "نام", required: true },
    phone: { type: "text", label: "تلفن", required: true },
    email: { type: "text", label: "ایمیل" },
    message: { type: "text", label: "پیام" },
    productId: { type: "select", label: "محصول", options: "product" },
  },
});


