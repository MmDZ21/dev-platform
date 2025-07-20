import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { RichTextViewer } from "@/components/admin/shared/RichTextViewer";
import { RelatedPosts } from "@/components/posts/RelatedPosts";
import { RelatedPostsFallback } from "@/components/posts/RelatedPostsFallback";
import { Suspense } from "react";
import Script from "next/script";

// --- Static params for SSG/ISR
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug }));
}

// --- SEO metadata per post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });
  if (!post) return { title: "پیدا نشد" };

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || undefined,
    alternates: {
      canonical: post.canonicalUrl || `/posts/${slug}`,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || undefined,
      images: [
        { url: `${process.env.SITE_URL}/og/posts/${slug}/opengraph-image.png` },
      ],
    },
  };
}

// --- ISR: Revalidate every 60 seconds
export const revalidate = 60;

// --- Main post page (never stream main post!)
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: { select: { name: true, slug: true } },
      tags: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!post) return notFound();

  // Generate structured data for this post
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.metaTitle || post.title,
    description: post.metaDescription || "",
    image: post.ogImage || post.imageUrl || undefined,
    author: {
      "@type": "Person",
      name: "Site Author Name", // (Replace with author field if you add)
    },
    datePublished: post.createdAt
      ? new Date(post.createdAt).toISOString()
      : undefined,
    dateModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://yourdomain.com/posts/${post.slug}`,
    },
    keywords: post.tags?.map((t) => t.name).join(", "),
    articleSection: post.category?.name || "",
  };

  return (
    <article className="prose dark:prose-invert mx-auto px-4 py-8">
      <h1 className="mb-2">{post.title}</h1>
      <div className="mb-2 flex gap-3 text-sm text-gray-500">
        {post.category && (
          <Link
            href={`/categories/${post.category.slug}`}
            className="text-green-700 hover:underline"
          >
            {post.category.name}
          </Link>
        )}
        {post.createdAt && (
          <span>{new Date(post.createdAt).toLocaleDateString("fa-IR")}</span>
        )}
      </div>
      {post.imageUrl && (
        <div className="mb-6">
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={800}
            height={400}
            className="max-h-96 w-full rounded object-cover"
            unoptimized={
              post.imageUrl.startsWith("http") &&
              post.imageUrl.includes("liara")
            }
            placeholder="empty"
            priority
          />
        </div>
      )}
      <RichTextViewer html={post.content || ""} />

      {post.tags?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-blue-200"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* --- Stream Related Posts! --- */}
      <Suspense fallback={<RelatedPostsFallback />}>
        <RelatedPosts tagIds={post.tags.map((t) => t.id)} excludeId={post.id} />
      </Suspense>

      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(schemaData)}
      </Script>
    </article>
  );
}
