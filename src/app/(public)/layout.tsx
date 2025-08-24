import { ReactNode } from "react";
import { getSiteSettings } from "@/cms/runtime";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const s = await getSiteSettings();
  const locale = s?.defaultLocale || "fa";
  const dir = (s?.directionByLocale as any)?.[locale] || "rtl";
  return <div dir={dir} data-locale={locale}>{children}</div>;
}


