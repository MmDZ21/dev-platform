import "@/themes";
import type { Metadata } from "next";
import { buildCanonical } from "@/cms/seo";
import { getPageByPathAndLocale, getSiteSettings, resolveLocaleAndPath } from "@/cms/runtime";
import { renderPageWithTheme, tryRenderDynamicWithTheme } from "@/cms/renderer";
import { getTheme } from "@/cms/registry";

export const revalidate = 60;

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const site = await getSiteSettings();
  const { slug } = await props.params;
  const path = `/blog/${slug}`;
  const { locale } = site ? resolveLocaleAndPath(["blog", slug], site) : ({ locale: "fa" } as const);
  const page = site ? await getPageByPathAndLocale(path, locale) : null;
  const title = page?.metaTitle || site?.metaTitle || undefined;
  const description = page?.metaDescription || site?.metaDescription || undefined;
  const canonical = buildCanonical(site?.baseUrl || undefined, path);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      images: page?.ogImage || site?.ogImage ? [page?.ogImage || (site?.ogImage as string)] : undefined,
      title,
      description,
    },
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const site = await getSiteSettings();
  if (!site) return null;
  const theme = getTheme(site.activeTheme);
  if (!theme) return null;
  const { slug } = await props.params;
  const path = `/blog/${slug}`;
  const { locale } = resolveLocaleAndPath(["blog", slug], site);
  const page = await getPageByPathAndLocale(path, locale);
  if (!page) {
    const maybe = await tryRenderDynamicWithTheme(site.activeTheme, { path, locale });
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


