import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 60;

// SSG: generate static params for all categories
export async function generateStaticParams() {
  const categories = await prisma.category.findMany({ select: { slug: true } });
  return categories.map((c) => ({ slug: c.slug }));
}

// Dynamic SEO for each category page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "دسته‌بندی پیدا نشد" };
  return {
    title: `مطالب دسته ${category.name}`,
    description: `تمام مطالب در دسته «${category.name}» را اینجا ببینید.`,
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true, name: true, posts: {
      select: {
        id: true, title: true, slug: true, imageUrl: true, metaDescription: true, createdAt: true,
      }
    }},
  });

  if (!category) return notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">دسته: {category.name}</h1>
      {category.posts.length === 0 && <p>هیچ مطلبی در این دسته وجود ندارد.</p>}
      <ul className="space-y-8">
        {category.posts.map(post => (
          <li key={post.id} className="border rounded-lg p-4 flex gap-4 items-center bg-white dark:bg-zinc-900">
            {post.imageUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={160}
                  height={96}
                  className="h-24 w-32 object-cover rounded-md shadow-sm"
                  unoptimized={post.imageUrl.startsWith("http") && post.imageUrl.includes("liara")}
                  placeholder="empty"
                />
              </div>
            )}
            <div>
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-xl font-semibold hover:text-blue-700 transition">{post.title}</h2>
              </Link>
              <div className="text-gray-500 text-sm mb-2">
                {post.createdAt && new Date(post.createdAt).toLocaleDateString("fa-IR")}
              </div>
              {post.metaDescription && (
                <p className="line-clamp-2 text-gray-700 dark:text-gray-300">{post.metaDescription}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
