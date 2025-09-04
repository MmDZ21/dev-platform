import { registerTheme } from "@/cms";
import type { ThemeManifest, PageDocument } from "@/cms/types";
import HomeLayout from "./layouts/HomeLayout";
import ProductsLayout from "./layouts/ProductsLayout";
import MainLayout from "./layouts/MainLayout";
import { Hero, heroSchema } from "./blocks/Hero";
import { HighlightCards, highlightCardsSchema } from "./blocks/HighlightCards";
import { BlogPost, blogPostSchema } from "./blocks/BlogPost";
import { ProductFilters, productFiltersSchema } from "./blocks/ProductFilters";
import { ProductGrid, productGridSchema } from "./blocks/ProductGrid";
import { ProductDetail, productDetailSchema } from "./blocks/ProductDetail";
import { Footer, footerSchema } from "./blocks/Footer";
import { prisma } from "@/lib/db";
import { NavBar, navBarSchema } from "./blocks/NavBar";
import { TopBar, topBarSchema } from "./blocks/TopBar";
import { ProductsCarousel, productsCategoriesSchema } from "./blocks/ProductsCarousel";
import { FullScreenContent, fullScreenContentSchema } from "./blocks/FullScreenContent";
import { ParallaxSection, parallaxSectionSchema } from "./blocks/ParallaxSection";
import { StatsSection, statsSectionSchema } from "./blocks/StatsSection";
import { NewsletterSection, newsletterSectionSchema } from "./blocks/NewsletterSection";

const manifest: ThemeManifest = {
  id: "ranin-v2",
  name: "Ranin V2",
  version: "2.0.0",
  assetsBasePath: "/themes/ranin-v2",
  defaultLayout: "main",
  layouts: {
    main: { key: "main", slots: ["topbar", "nav", "content", "footer"], Component: MainLayout },
    home: { key: "home", slots: ["topbar", "nav", "hero", "highlights", "stats", "parallax", "sections", "newsletter", "content", "footer"], Component: HomeLayout },
    products: { key: "products", slots: ["topbar", "nav", "filters", "content", "footer"], Component: ProductsLayout },
  },
  blocks: {
    "ranin-v2.hero": { type: "ranin-v2.hero", schema: heroSchema, Component: Hero },
    "ranin-v2.highlightCards": { type: "ranin-v2.highlightCards", schema: highlightCardsSchema, Component: HighlightCards },
    "ranin-v2.nav": { type: "ranin-v2.nav", schema: navBarSchema, Component: NavBar },
    "ranin-v2.topbar": { type: "ranin-v2.topbar", schema: topBarSchema, Component: TopBar },
    "ranin-v2.footer": { type: "ranin-v2.footer", schema: footerSchema, Component: Footer },
    "ranin-v2.productFilters": { type: "ranin-v2.productFilters", schema: productFiltersSchema, Component: ProductFilters },
    "ranin-v2.productGrid": { type: "ranin-v2.productGrid", schema: productGridSchema, Component: ProductGrid },
    "ranin-v2.productDetail": { type: "ranin-v2.productDetail", schema: productDetailSchema, Component: ProductDetail },
    "ranin-v2.blogPost": { type: "ranin-v2.blogPost", schema: blogPostSchema, Component: BlogPost },
    "ranin-v2.productsCarousel": { type: "ranin-v2.productsCarousel", schema: productsCategoriesSchema, Component: ProductsCarousel },
    "ranin-v2.fullScreenContent": { type: "ranin-v2.fullScreenContent", schema: fullScreenContentSchema, Component: FullScreenContent },
    "ranin-v2.parallaxSection": { type: "ranin-v2.parallaxSection", schema: parallaxSectionSchema, Component: ParallaxSection },
    "ranin-v2.statsSection": { type: "ranin-v2.statsSection", schema: statsSectionSchema, Component: StatsSection },
    "ranin-v2.newsletterSection": { type: "ranin-v2.newsletterSection", schema: newsletterSectionSchema, Component: NewsletterSection },
  },
  resolveDynamic: async ({ path, locale, searchParams }) => {
    if (path === "/products") {
      const category = (searchParams?.category as string) || undefined;
      const q = (searchParams?.q as string) || undefined;
      const page: PageDocument = {
        id: "ranin-v2-products-list",
        title: "محصولات",
        path,
        locale,
        layoutKey: "products",
        slots: {
          topbar: [{ type: "ranin-v2.topbar", props: {} }],
          nav: [{ type: "ranin-v2.nav", props: {} }],
          filters: [{ type: "ranin-v2.productFilters", props: {} }],
          content: [{ type: "ranin-v2.productGrid", props: { title: "همه محصولات", category, q, limit: 12 } }],
          footer: [{ type: "ranin-v2.footer", props: { note: "© Ranin 2025" } }],
        },
      };
      return page;
    }
    const productMatch = path.match(/^\/products\/(.+)$/);
    if (productMatch) {
      const slug = productMatch[1];
      const exists = await prisma.product.findUnique({ where: { slug } });
      if (!exists) return null;
      const page: PageDocument = {
        id: `ranin-v2-product-${slug}`,
        title: exists.name,
        path,
        locale,
        layoutKey: "products",
        slots: {
          topbar: [{ type: "ranin-v2.topbar", props: {} }],
          nav: [{ type: "ranin-v2.nav", props: {} }],
          filters: [],
          content: [{ type: "ranin-v2.productDetail", props: { slug } }],
          footer: [{ type: "ranin-v2.footer", props: { note: "© Ranin 2025" } }],
        },
        metaTitle: exists.metaTitle || exists.name,
        metaDescription: exists.metaDescription || undefined,
        ogImage: exists.ogImage || undefined,
      };
      return page;
    }
    const blogMatch = path.match(/^\/blog\/(.+)$/);
    if (blogMatch) {
      const slug = blogMatch[1];
      const exists = await prisma.post.findUnique({ where: { slug } });
      if (!exists || exists.draft) return null;
      const page: PageDocument = {
        id: `ranin-v2-blog-${slug}`,
        title: exists.title,
        path,
        locale,
        layoutKey: "home",
        slots: {
          topbar: [{ type: "ranin-v2.topbar", props: {} }],
          nav: [{ type: "ranin-v2.nav", props: {} }],
          hero: [],
          highlights: [],
          sections: [{ type: "ranin-v2.blogPost", props: { slug } }],
          footer: [{ type: "ranin-v2.footer", props: { note: "© Ranin 2025" } }],
        },
        metaTitle: exists.metaTitle || exists.title,
        metaDescription: exists.metaDescription || undefined,
        ogImage: exists.ogImage || undefined,
      };
      return page;
    }
    return null;
  },
};

registerTheme(manifest);
export default manifest;