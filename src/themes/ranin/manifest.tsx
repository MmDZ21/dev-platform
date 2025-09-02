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
  id: "ranin",
  name: "Ranin",
  version: "0.1.0",
  assetsBasePath: "/themes/ranin",
  defaultLayout: "main",
  layouts: {
    main: { key: "main", slots: ["topbar", "nav", "content", "footer"], Component: MainLayout },
    home: { key: "home", slots: ["topbar", "nav", "hero", "highlights", "stats", "parallax", "sections", "newsletter", "content", "footer"], Component: HomeLayout },
    products: { key: "products", slots: ["topbar", "nav", "filters", "content", "footer"], Component: ProductsLayout },
  },
  blocks: {
    "ranin.hero": { type: "ranin.hero", schema: heroSchema, Component: Hero },
    "ranin.highlightCards": { type: "ranin.highlightCards", schema: highlightCardsSchema, Component: HighlightCards },
    "ranin.nav": { type: "ranin.nav", schema: navBarSchema, Component: NavBar },
    "ranin.topbar": { type: "ranin.topbar", schema: topBarSchema, Component: TopBar },
    "ranin.footer": { type: "ranin.footer", schema: footerSchema, Component: Footer },
    "ranin.productFilters": { type: "ranin.productFilters", schema: productFiltersSchema, Component: ProductFilters },
    "ranin.productGrid": { type: "ranin.productGrid", schema: productGridSchema, Component: ProductGrid },
    "ranin.productDetail": { type: "ranin.productDetail", schema: productDetailSchema, Component: ProductDetail },
    "ranin.blogPost": { type: "ranin.blogPost", schema: blogPostSchema, Component: BlogPost },
    "ranin.productsCarousel": { type: "ranin.productsCarousel", schema: productsCategoriesSchema, Component: ProductsCarousel },
    "ranin.fullScreenContent": { type: "ranin.fullScreenContent", schema: fullScreenContentSchema, Component: FullScreenContent },
    "ranin.parallaxSection": { type: "ranin.parallaxSection", schema: parallaxSectionSchema, Component: ParallaxSection },
    "ranin.statsSection": { type: "ranin.statsSection", schema: statsSectionSchema, Component: StatsSection },
    "ranin.newsletterSection": { type: "ranin.newsletterSection", schema: newsletterSectionSchema, Component: NewsletterSection },
  },
  resolveDynamic: async ({ path, locale, searchParams }) => {
    if (path === "/products") {
      const category = (searchParams?.category as string) || undefined;
      const q = (searchParams?.q as string) || undefined;
      const page: PageDocument = {
        id: "ranin-products-list",
        title: "محصولات",
        path,
        locale,
        layoutKey: "products",
        slots: {
          topbar: [{ type: "ranin.topbar", props: {} }],
          nav: [{ type: "ranin.nav", props: {} }],
          filters: [{ type: "ranin.productFilters", props: {} }],
          content: [{ type: "ranin.productGrid", props: { title: "همه محصولات", category, q, limit: 12 } }],
          footer: [{ type: "ranin.footer", props: { note: "© Ranin 2025" } }],
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
        id: `ranin-product-${slug}`,
        title: exists.name,
        path,
        locale,
        layoutKey: "products",
        slots: {
          topbar: [{ type: "ranin.topbar", props: {} }],
          nav: [{ type: "ranin.nav", props: {} }],
          filters: [],
          content: [{ type: "ranin.productDetail", props: { slug } }],
          footer: [{ type: "ranin.footer", props: { note: "© Ranin 2025" } }],
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
        id: `ranin-blog-${slug}`,
        title: exists.title,
        path,
        locale,
        layoutKey: "home",
        slots: {
          topbar: [{ type: "ranin.topbar", props: {} }],
          nav: [{ type: "ranin.nav", props: {} }],
          hero: [],
          highlights: [],
          sections: [{ type: "ranin.blogPost", props: { slug } }],
          footer: [{ type: "ranin.footer", props: { note: "© Ranin 2025" } }],
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


