import { z } from "zod";

export const footerSchema = z.object({
  columns: z.array(
    z.object({
      title: z.string(),
      links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    })
  ).default([]),
  note: z.string().optional(),
});

export async function Footer(props: z.infer<typeof footerSchema> & { locale: string }) {
  return (
    <footer className="border-t border-gray-200 bg-white" dir="rtl">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-4 py-10 md:grid-cols-4">
        {props.columns.map((col, i) => (
          <div key={i}>
            <h4 className="mb-3 text-sm font-semibold text-gray-800">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l, j) => (
                <li key={j}><a href={l.href} className="text-sm text-gray-600 hover:text-black">{l.label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 pb-8 text-xs text-gray-500">{props.note}</div>
    </footer>
  );
}


