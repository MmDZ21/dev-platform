import { z } from "zod";

export const highlightCardsSchema = z.object({
  items: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      href: z.string().optional(),
    })
  ).default([]),
  columns: z.number().int().min(1).max(4).default(3),
});

export async function HighlightCards(props: z.infer<typeof highlightCardsSchema> & { locale: string }) {
  const cols = Math.min(4, Math.max(1, props.columns));
  const cls = cols === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : cols === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1";
  return (
    <div className={`grid ${cls} gap-5`} dir="rtl">
      {props.items.map((it, idx) => (
        <a key={idx} href={it.href || "#"} className="block rounded-lg border border-gray-200 p-5 hover:shadow-sm">
          <div className="text-lg font-semibold text-gray-900">{it.title}</div>
          {it.description ? (
            <p className="mt-2 text-sm text-gray-600">{it.description}</p>
          ) : null}
        </a>
      ))}
    </div>
  );
}


