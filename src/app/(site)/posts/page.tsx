import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { SearchBox } from "@/components/posts/SearchBox";

// Pagination settings
const PAGE_SIZE = 10;

type PostsPageProps = {
  searchParams?: Promise<{ page?: string; q?: string }>;
};

export const revalidate = 60;

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const search =(await searchParams)?.q?.trim() ?? "";
  const page = Number((await searchParams)?.page) > 0 ? Number((await searchParams)?.page) : 1;
  const skip = (page - 1) * PAGE_SIZE;

  const where: any = { published: true };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { metaDescription: { contains: search, mode: "insensitive" } },
    ];
  }

  const [totalCount, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        metaDescription: true,
        createdAt: true,
        category: { select: { slug: true, name: true } }, // Fetch category
      },
    }),
  ]);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">آخرین مطالب</h1>
      <SearchBox />
      <ul className="space-y-8">
        {posts.map((post) => (
          <li
            key={post.id}
            className="flex items-center gap-4 rounded-lg border bg-white p-4 dark:bg-zinc-900"
          >
            {post.imageUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={160}
                  height={96}
                  className="h-24 w-32 rounded-md object-cover shadow-sm"
                  unoptimized={
                    post.imageUrl.startsWith("http") &&
                    post.imageUrl.includes("liara")
                  }
                  placeholder="empty"
                  priority={false}
                />
              </div>
            )}
            <div>
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-xl font-semibold transition hover:text-blue-700">
                  {post.title}
                </h2>
              </Link>
              <div className="flex gap-3 text-sm text-gray-500 mb-2">
                {post.createdAt &&
                  <span>{new Date(post.createdAt).toLocaleDateString("fa-IR")}</span>
                }
                {post.category && (
                  <>
                    <span>|</span>
                    <Link
                      href={`/categories/${post.category.slug}`}
                      className="text-green-700 hover:underline"
                    >
                      {post.category.name}
                    </Link>
                  </>
                )}
              </div>
              {post.metaDescription && (
                <p className="line-clamp-2 text-gray-700 dark:text-gray-300">
                  {post.metaDescription}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i}
            href={`/posts?page=${i + 1}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
            className={`rounded border px-3 py-1 ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white dark:bg-zinc-900"}`}
            aria-current={page === i + 1 ? "page" : undefined}
          >
            {i + 1}
          </Link>
        ))}
      </div>
    </main>
  );
}
