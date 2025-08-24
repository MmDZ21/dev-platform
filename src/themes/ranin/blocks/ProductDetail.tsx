import { z } from "zod";
import { prisma } from "@/lib/db";

export const productDetailSchema = z.object({
  slug: z.string(),
});

export async function ProductDetail(props: z.infer<typeof productDetailSchema> & { locale: string }) {
  const product = await prisma.product.findUnique({ where: { slug: props.slug } });
  if (!product) return null;
  return (
    <article className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
      {product.description ? <div className="prose" dangerouslySetInnerHTML={{ __html: product.description }} /> : null}
      {product.imageUrls?.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {product.imageUrls.map((url, idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={idx} src={url} alt="" className="rounded border" />
          ))}
        </div>
      ) : null}
      {product.datasheetUrl ? (
        <a href={product.datasheetUrl} className="inline-block rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
          دانلود دیتاشیت
        </a>
      ) : null}
    </article>
  );
}


