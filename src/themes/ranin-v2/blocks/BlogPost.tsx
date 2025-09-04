import { z } from "zod";
import { prisma } from "@/lib/db";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { Heading, Text } from "../design-system";

export const blogPostSchema = z.object({
  slug: z.string(),
});

export async function BlogPost(props: z.infer<typeof blogPostSchema> & { locale: string }) {
  const post = await prisma.post.findUnique({ where: { slug: props.slug } });
  if (!post || post.draft) return null;
  return (
    <article>
      <Heading level={1} className="mb-4 text-foreground">{post.title}</Heading>
      {post.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.imageUrl} alt={post.title || ""} className="mb-6 rounded border" />
      ) : null}
      {post.content ? (
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
      ) : (
        <Text className="text-muted-foreground">No content.</Text>
      )}
    </article>
  );
}


