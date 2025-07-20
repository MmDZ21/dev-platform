import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

type RelatedPostsProps = {
  tagIds: string[];
  excludeId: string;
  count?: number;
};

export async function RelatedPosts({
  tagIds,
  excludeId,
  count = 4,
}: RelatedPostsProps) {
  if (!tagIds.length) return null;

  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      id: { not: excludeId },
      tags: { some: { id: { in: tagIds } } },
    },
    orderBy: { createdAt: "desc" },
    take: count,
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      category: { select: { slug: true, name: true } },
    },
  });

  if (!relatedPosts.length) return null;

  return (
    <section className="mt-12">
      <h3 className="mb-4 text-lg font-bold">مطالب مرتبط</h3>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {relatedPosts.map((rp) => (
          <li
            key={rp.id}
            className="flex items-center gap-3 rounded border bg-white p-3 dark:bg-zinc-900"
          >
            {rp.imageUrl && (
              <Image
                src={rp.imageUrl}
                alt={rp.title}
                width={80}
                height={48}
                className="h-12 w-20 rounded object-cover"
                unoptimized
              />
            )}
            <div>
              <Link href={`/posts/${rp.slug}`}>
                <span className="font-medium text-blue-700 hover:underline">
                  {rp.title}
                </span>
              </Link>
              {rp.category && (
                <div className="text-xs text-gray-600">
                  <Link
                    href={`/categories/${rp.category.slug}`}
                    className="text-green-700 hover:underline"
                  >
                    {rp.category.name}
                  </Link>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
