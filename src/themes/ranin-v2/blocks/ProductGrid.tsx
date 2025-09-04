import { z } from "zod";
import { prisma } from "@/lib/db";
import Image from "next/image";

export const productGridSchema = z.object({
  title: z.string().optional(),
  category: z.string().optional(),
  q: z.string().optional(),
  limit: z.number().int().min(1).max(60).default(12),
});

export async function ProductGrid(props: z.infer<typeof productGridSchema> & { locale: string }) {
  const category = props.category
    ? await prisma.productCategory.findUnique({ where: { slug: props.category } })
    : null;

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      ...(category ? { categoryId: category.id } : {}),
      ...(props.q ? { name: { contains: props.q, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: props.limit,
  });

  return (
    <div>
      {props.title ? <h3 className="mb-3 text-lg font-semibold">{props.title}</h3> : null}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <a key={p.id} href={`/products/${p.slug}`} className="block rounded border p-4 transition-all duration-200 hover:shadow-md">
            {/* Product Image */}
            <div className="mb-3 aspect-square overflow-hidden rounded border bg-gray-50">
              <Image
                src="/images/relay.png"
                alt={p.name}
                width={200}
                height={200}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="h-full w-full object-contain p-2"
                loading="lazy"
              />
            </div>
            
            {/* Product Info */}
            <div className="font-medium text-foreground">{p.name}</div>
            {p.summary ? <div className="text-sm text-muted-foreground mt-1">{p.summary}</div> : null}
          </a>
        ))}
      </div>
    </div>
  );
}


