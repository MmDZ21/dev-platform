import { SiteSettingsDoc } from "./types";

export function buildCanonical(baseUrl: string | undefined | null, path: string): string | undefined {
  if (!baseUrl) return undefined;
  const normalized = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${normalized}${p}`;
}

export function buildAlternateLocales(
  site: SiteSettingsDoc,
  path: string
): Array<{ hrefLang: string; href: string }> {
  // Since locale is not part of the URL, alternates collapse to single canonical.
  const canonical = buildCanonical(site.baseUrl, path) || path;
  return [{ hrefLang: site.defaultLocale, href: canonical }];
}

export function productJsonLd(input: {
  name: string;
  image?: string[];
  description?: string;
  sku?: string;
  brand?: string;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    image: input.image,
    description: input.description,
    sku: input.sku,
    brand: input.brand ? { '@type': 'Brand', name: input.brand } : undefined,
    url: input.url,
  };
}


