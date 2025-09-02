import "@/themes"; // ensure themes are registered
import { renderPageWithTheme, tryRenderDynamicWithTheme } from "@/cms/renderer";
import { getTheme } from "@/cms/registry";
import { buildAlternateLocales, buildCanonical } from "@/cms/seo";
import { getPageByPathAndLocale, getSiteSettings, resolveLocaleAndPath } from "@/cms/runtime";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const site = await getSiteSettings();
  const { slug } = await props.params;
  const { locale, path } = site ? resolveLocaleAndPath(slug, site) : ({ locale: "fa", path: "/" } as const);
  const page = site ? await getPageByPathAndLocale(path, locale) : null;

  const title = page?.metaTitle || site?.metaTitle || undefined;
  const description = page?.metaDescription || site?.metaDescription || undefined;
  const canonical = buildCanonical(site?.baseUrl || undefined, page?.path || "/");
  const alternates = site ? buildAlternateLocales(site, page?.path || "/") : [];

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      images: page?.ogImage || site?.ogImage ? [page?.ogImage || (site?.ogImage as string)] : undefined,
      url: canonical,
      title,
      description,
    },
    other: {
      // Basic Schema.org Organization; product pages handled in theme
      'script:ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': site?.metaTitle ?? undefined,
        'url': site?.baseUrl ?? undefined,
      })
    }
  };
}

export default async function PublicPage(props: { params: Promise<{ slug?: string[] }>; searchParams?: Promise<Record<string, string | string[]>> }) {
  const site = await getSiteSettings();
  if (!site) return null;
  const theme = getTheme(site.activeTheme);
  if (!theme) return null;

  const [{ slug }, search] = await Promise.all([props.params, props.searchParams ?? Promise.resolve({})]);
  const { locale, path } = resolveLocaleAndPath(slug, site);
  const page = await getPageByPathAndLocale(path, locale);
  if (!page) {
    // Let theme create virtual pages (e.g., /products/slug) without hardcoding
    const maybe = await tryRenderDynamicWithTheme(site.activeTheme, { path, locale, searchParams: (await search) as Record<string, string | string[]> });
    if (maybe) return maybe;
    return null;
  }

  return await renderPageWithTheme(site.activeTheme, {
    id: page.id,
    title: page.title,
    path: page.path,
    locale: page.locale,
    layoutKey: page.layoutKey,
    slots: (page.slots as any) || {},
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    canonicalUrl: page.canonicalUrl,
    ogImage: page.ogImage,
  });
}


