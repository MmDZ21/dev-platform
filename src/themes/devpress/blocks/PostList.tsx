import { z } from "zod";
import { prisma } from "@/lib/db";

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
      <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
        {posts.map((p) => (
          <li key={p.id} className="p-4 hover:bg-gray-50">
            <a href={`/blog/${p.slug}`} className="font-medium text-gray-900 hover:underline">
              {p.title}
            </a>
            {p.summary ? <p className="text-sm text-gray-600">{p.summary}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}


