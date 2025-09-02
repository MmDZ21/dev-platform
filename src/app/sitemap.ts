import { prisma } from "@/lib/db";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags, products] = await Promise.all([
    prisma.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.tag.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.product.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticPages = [
    "",
    "posts",
    "categories",
    "tags",
    // Add any others here
  ];

  // SitemapEntry[]
  return [
    // Static pages
    ...staticPages.map((page) => ({
      url: `${SITE_URL}/${page}`,
      lastModified: new Date(),
    })),
    // Posts
    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: post.updatedAt,
    })),
    // Categories
    ...categories.map((cat) => ({
      url: `${SITE_URL}/categories/${cat.slug}`,
      lastModified: cat.updatedAt,
    })),
    // Tags
    ...tags.map((tag) => ({
      url: `${SITE_URL}/tags/${tag.slug}`,
      lastModified: tag.updatedAt,
    })),
    // Products
    ...products.map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: p.updatedAt,
    })),
  ];
}
