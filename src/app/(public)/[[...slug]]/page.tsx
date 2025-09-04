import { loadTheme, renderPage, tryResolveDynamic, tryResolveDynamicPageData } from "@/lib/simple-theme";
import { buildAlternateLocales, buildCanonical } from "@/cms/seo";
import { getPageByPathAndLocale, getSiteSettings, resolveLocaleAndPath } from "@/cms/runtime";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const site = await getSiteSettings();
  const { slug } = await props.params;
  const { locale, path } = site ? resolveLocaleAndPath(slug, site) : ({ locale: "fa", path: "/" } as const);
  const page = site ? await getPageByPathAndLocale(path, locale) : null;

  // Try dynamic route metadata when no CMS page exists
  const themeId = site?.activeTheme || "ranin-v2";
  const dyn = !page && site ? await tryResolveDynamicPageData({ themeId, path, locale }) : null;

  const title = page?.metaTitle || dyn?.meta?.title || site?.metaTitle || undefined;
  const description = page?.metaDescription || dyn?.meta?.description || site?.metaDescription || undefined;
  const basePath = page?.path || path || "/";
  const canonical = dyn?.meta?.canonical || buildCanonical(site?.baseUrl || undefined, basePath);
  const alternates = site ? buildAlternateLocales(site, basePath) : [];
  const ogImage = page?.ogImage || dyn?.meta?.ogImage || (site?.ogImage as string | undefined);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      images: ogImage ? [ogImage] : undefined,
      url: canonical,
      title,
      description,
    },
    other: {
      // Basic Schema.org Organization; product pages or others can be extended later
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

  // Ensure theme is loaded
  const themeId = site.activeTheme || "ranin-v2";
  await loadTheme(themeId);

  const [{ slug }, search] = await Promise.all([props.params, props.searchParams ?? Promise.resolve({})]);
  const { locale, path } = resolveLocaleAndPath(slug, site);
  const page = await getPageByPathAndLocale(path, locale);
  
  if (!page) {
    // Try dynamic route resolution with simple theme system
    const dynamicContent = await tryResolveDynamic({ 
      themeId,
      path, 
      locale, 
      searchParams: (await search) as Record<string, string | string[]> 
    });
    if (dynamicContent) return dynamicContent;
    return null;
  }

  // Convert old CMS page format to new theme system format
  const pageData = {
    id: page.id,
    title: page.title,
    layout: convertLayoutKey(page.layoutKey),
    slots: convertSlotsToNewFormat(page.slots as any || {}),
    meta: {
      title: page.metaTitle || undefined,
      description: page.metaDescription || undefined,
      ogImage: page.ogImage || undefined,
      canonical: page.canonicalUrl || undefined,
    }
  };

  return renderPage(themeId, pageData);
}

// Helper function to convert old slot format to new format
function convertSlotsToNewFormat(oldSlots: Record<string, Array<{ type: string; props: unknown }>>): Record<string, Array<{ type: string; props: unknown }>> {
  const newSlots: Record<string, Array<{ type: string; props: unknown }>> = {};
  
  for (const [slotName, blocks] of Object.entries(oldSlots)) {
    newSlots[slotName] = blocks.map(block => ({
      type: convertBlockType(block.type),
      props: block.props
    }));
  }
  
  return newSlots;
}

// Convert old layout keys to new theme system layout names
function convertLayoutKey(layoutKey?: string): string {
  const layoutMapping: Record<string, string> = {
    'home': 'HomeLayout',
    'main': 'MainLayout', 
    'products': 'ProductsLayout',
  };
  
  if (!layoutKey) return 'HomeLayout'; // default
  return layoutMapping[layoutKey] || 'HomeLayout';
}

// Convert old block types to new theme system component names
function convertBlockType(oldType: string): string {
  // Remove theme prefix (e.g., "ranin-v2.TopBar" -> "TopBar")
  const base = oldType.includes('.') ? (oldType.split('.').pop() || oldType) : oldType;
  const key = base.replace(/\s+/g, '').replace(/_/g, '').replace(/-/g, '').toLowerCase();
  const aliasMap: Record<string, string> = {
    nav: 'NavBar',
    navbar: 'NavBar',
    topbar: 'TopBar',
    footer: 'Footer',
    hero: 'Hero',
    highlightcards: 'HighlightCards',
    highlightcard: 'HighlightCards',
    parallax: 'ParallaxSection',
    parallaxsection: 'ParallaxSection',
    productscarousel: 'ProductsCarousel',
    productscarouselsection: 'ProductsCarousel',
    productgrid: 'ProductGrid',
    productdetail: 'ProductDetail',
    productfilters: 'ProductFilters',
    newsletter: 'NewsletterSection',
    newslettersection: 'NewsletterSection',
    stats: 'StatsSection',
    statssection: 'StatsSection',
    fullscreencontent: 'FullScreenContent',
    fullscreen: 'FullScreenContent',
    blogpost: 'BlogPost'
  };
  return aliasMap[key] || base;
}


