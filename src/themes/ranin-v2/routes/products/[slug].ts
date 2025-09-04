import { prisma } from '@/lib/db';

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return null;

    return {
      id: `ranin-v2-product-${slug}`,
      title: product.name,
      layout: 'ProductsLayout',
      slots: {
        filters: [],
        content: [{ type: 'ProductDetail', props: { slug } }],
      },
      meta: {
        title: product.metaTitle || product.name,
        description: product.metaDescription || undefined,
        ogImage: product.ogImage || undefined,
      },
    };
  } catch (_err) {
    return null;
  }
}


