import { prisma } from "@/lib/db";
import { SiteSettingsDoc } from "./types";

export async function getSiteSettings(): Promise<SiteSettingsDoc | null> {
  try {
    const s = await prisma.siteSetting.findFirst();
    if (!s) return null;
    return {
      id: s.id,
      activeTheme: s.activeTheme,
      defaultLocale: s.defaultLocale,
      supportedLocales: s.supportedLocales,
      directionByLocale: s.directionByLocale as any,
      baseUrl: s.baseUrl,
      themeSettings: s.themeSettings as any,
      metaTitle: s.metaTitle,
      metaDescription: s.metaDescription,
      ogImage: s.ogImage,
    };
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    // Return default settings when database is unavailable
    return {
      id: 'default',
      activeTheme: 'ranin-v2',
      defaultLocale: 'fa',
      supportedLocales: ['fa'],
      directionByLocale: { fa: 'rtl' },
      baseUrl: process.env.SITE_URL || 'https://localhost:3000',
      themeSettings: {},
      metaTitle: 'Dev Platform',
      metaDescription: 'Development Platform',
      ogImage: null,
    };
  }
}

export function resolveLocaleAndPath(
  segments: string[] | undefined,
  site: SiteSettingsDoc
): { locale: string; path: string } {
  const segs = segments ?? [];
  // Do not use locale in URL. Always resolve to default locale and raw path.
  const path = "/" + (segs.join("/") || "");
  return { locale: site.defaultLocale, path: path === "/" ? "/" : path };
}

export async function getPageByPathAndLocale(path: string, locale: string) {
  try {
    return await prisma.page.findUnique({ where: { locale_path: { locale, path } } });
  } catch (error) {
    console.error('Failed to fetch page:', error);
    return null;
  }
}


