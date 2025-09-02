import { z } from "zod";
import NavBarClient from "./NavBarClient";

export const navBarSchema = z.object({
  brand: z.string().default("رانین فرایند"),
  items: z.array(z.object({ 
    label: z.string(), 
    href: z.string().optional(),
    megaMenu: z.object({
      columns: z.array(z.object({
        title: z.string(),
        links: z.array(z.object({
          label: z.string(),
          href: z.string(),
          description: z.string().optional()
        }))
      }))
    }).optional()
  })).default([
    { 
      label: "محصولات", 
      megaMenu: {
        columns: [
          {
            title: "راهکارهای کسب‌وکار",
            links: [
              { label: "مدیریت پروژه", href: "/products/project-management", description: "ابزارهای پیشرفته مدیریت پروژه" },
              { label: "تحلیل داده", href: "/products/analytics", description: "تحلیل و گزارش‌گیری هوشمند" },
              { label: "اتوماسیون", href: "/products/automation", description: "خودکارسازی فرآیندهای کسب‌وکار" }
            ]
          },
          {
            title: "راهکارهای فنی",
            links: [
              { label: "توسعه نرم‌افزار", href: "/products/software-development", description: "توسعه اپلیکیشن‌های کاربردی" },
              { label: "زیرساخت ابری", href: "/products/cloud-infrastructure", description: "خدمات ابری و میزبانی" },
              { label: "امنیت سایبری", href: "/products/cybersecurity", description: "حفاظت از داده‌ها و سیستم‌ها" }
            ]
          }
        ]
      }
    },
    { 
      label: "خدمات", 
      megaMenu: {
        columns: [
          {
            title: "مشاوره",
            links: [
              { label: "مشاوره استراتژیک", href: "/services/strategy", description: "برنامه‌ریزی استراتژیک کسب‌وکار" },
              { label: "مشاوره فنی", href: "/services/technical", description: "راهنمایی‌های تخصصی فنی" }
            ]
          },
          {
            title: "پیاده‌سازی",
            links: [
              { label: "راه‌اندازی سیستم", href: "/services/implementation", description: "پیاده‌سازی سیستم‌های سازمانی" },
              { label: "آموزش", href: "/services/training", description: "آموزش کاربران و تیم‌ها" }
            ]
          }
        ]
      }
    },
    { label: "بینش‌ها", href: "/insights" },
    { label: "درباره ما", href: "/about" },
    { label: "تماس", href: "/contact" },
  ]),
});

export async function NavBar(props: z.infer<typeof navBarSchema> & { locale: string }) {
  return <NavBarClient {...props} />;
}


