import { prisma } from "@/lib/db";
import Link from "next/link";

export const revalidate = 60;

export default async function CategoriesListPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">دسته‌بندی‌ها</h1>
      <ul className="space-y-4">
        {categories.map(cat => (
          <li key={cat.id}>
            <Link
              href={`/categories/${cat.slug}`}
              className="text-lg font-medium text-green-700 hover:underline"
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
