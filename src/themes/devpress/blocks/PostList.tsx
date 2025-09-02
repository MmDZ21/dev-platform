import { z } from "zod";
import { prisma } from "@/lib/db";
import { Card, CardBody } from "../design-system";

export const postListSchema = z.object({
  title: z.string().optional(),
  limit: z.number().int().min(1).max(50).default(5),
});

export async function PostListBlock(props: z.infer<typeof postListSchema> & { locale: string }) {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: props.limit,
  });
  return (
    <div className="space-y-4" key={props.title}>
      {props.title ? <h3 className="text-xl font-semibold">{props.title}</h3> : null}
      <div className="space-y-3">
        {posts.map((p) => (
          <Card key={p.id}>
            <CardBody>
              <a href={`/blog/${p.slug}`} className="font-medium text-foreground hover:underline">
                {p.title}
              </a>
              {p.summary ? <p className="text-sm text-muted-foreground">{p.summary}</p> : null}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}


