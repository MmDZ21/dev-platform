import { ReactNode } from "react";
import { getSiteSettings } from "@/cms/runtime";
import { ThemeProvider } from "@/app/theme-provider";
import "@/themes/ranin/tokens.css";
import "@/themes/devpress/tokens.css";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const s = await getSiteSettings();
  const locale = s?.defaultLocale || "fa";
  const dir = (s?.directionByLocale as any)?.[locale] || "rtl";
  return (
    <div dir={dir} data-locale={locale}>
      <ThemeProvider />
      {children}
    </div>
  );
}


