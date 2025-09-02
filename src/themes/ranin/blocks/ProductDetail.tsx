import { z } from "zod";
import { prisma } from "@/lib/db";
import Image from "next/image";

export const productDetailSchema = z.object({
  slug: z.string(),
});

export async function ProductDetail(props: z.infer<typeof productDetailSchema> & { locale: string }) {
  const product = await prisma.product.findUnique({ where: { slug: props.slug } });
  if (!product) return null;
  
  return (
    <article className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">{product.title || product.name}</h1>
      {product.shortDesc ? <p className="text-muted-foreground">{product.shortDesc}</p> : null}
      {product.description ? <div className="prose" dangerouslySetInnerHTML={{ __html: product.description }} /> : null}
      
      {/* Product Images */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {product.images?.length ? (
          product.images.map((url, idx) => (
            <div key={idx} className="aspect-square overflow-hidden rounded border bg-gray-50">
              <Image
                src={url}
                alt={`${product.name} - Image ${idx + 1}`}
                width={300}
                height={300}
                className="h-full w-full object-contain p-2"
              />
            </div>
          ))
        ) : (
          // Fallback to relay.png when no images
          <div className="aspect-square overflow-hidden rounded border bg-gray-50">
            <Image
              src="/images/relay.png"
              alt={product.name}
              width={300}
              height={300}
              className="h-full w-full object-contain p-2"
            />
          </div>
        )}
      </div>
      
      {product.datasheetUrl ? (
        <a href={product.datasheetUrl} className="inline-block rounded bg-primary px-4 py-2 text-primary-foreground hover:opacity-95">
          دانلود دیتاشیت
        </a>
      ) : null}
    </article>
  );
}


