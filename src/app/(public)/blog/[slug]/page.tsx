import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { buildCanonical } from "@/cms/seo";
import { getSiteSettings } from "@/cms/runtime";
import { sanitizeHtml } from "@/lib/sanitize-html";

export const revalidate = 60;

async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const site = await getSiteSettings();
  const { slug } = await props.params;
  const post = await getPost(slug);
  const canonical = buildCanonical(site?.baseUrl || undefined, `/blog/${slug}`);
  const title = post?.metaTitle || post?.title || site?.metaTitle || undefined;
  const description = post?.metaDescription || site?.metaDescription || undefined;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      images: post?.ogImage || site?.ogImage ? [post?.ogImage || (site?.ogImage as string)] : undefined,
      title,
      description,
    },
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post || post.draft) return null;
  return (
    <article className="prose max-w-3xl py-10">
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      {post.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.imageUrl} alt={post.title} className="mb-6 rounded" />
      ) : null}
      {post.content ? (
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
      ) : (
        <p className="text-gray-600">No content.</p>
      )}
    </article>
  );
}


