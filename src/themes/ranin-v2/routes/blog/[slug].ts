import { prisma } from '@/lib/db';

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post || post.draft) return null;

    return {
      id: `ranin-v2-blog-${slug}`,
      title: post.title,
      layout: 'HomeLayout',
      slots: {
        sections: [{ type: 'BlogPost', props: { slug } }],
      },
      meta: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || undefined,
        ogImage: post.ogImage || undefined,
      },
    };
  } catch (_err) {
    return null;
  }
}


