import { z } from "zod";
import { prisma } from "@/lib/db";

export const productFiltersSchema = z.object({
  title: z.string().optional(),
});

export async function ProductFilters(_: z.infer<typeof productFiltersSchema> & { locale: string }) {
  const roots = await prisma.productCategory.findMany({ where: { parentId: null }, orderBy: { order: "asc" } });
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-700">دسته‌بندی‌ها</h3>
      <ul className="space-y-2">
        {roots.map((c) => (
          <li key={c.id}>
            <a className="text-gray-700 hover:underline" href={`/products?category=${c.slug}`}>{c.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}


