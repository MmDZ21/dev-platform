import { z } from "zod";

const relativePath = z.string().regex(/^\//, "must start with /");
export const heroSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.union([z.string().url(), relativePath]).optional(),
  imageUrl: z.union([z.string().url(), relativePath]).optional(),
});

export async function Hero(props: z.infer<typeof heroSchema> & { locale: string }) {
  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12" dir="rtl">
      <div className="md:col-span-7">
        <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900">{props.title}</h1>
        {props.subtitle ? (
          <p className="mb-6 text-lg text-gray-700">{props.subtitle}</p>
        ) : null}
        {props.ctaHref && props.ctaLabel ? (
          <a
            href={props.ctaHref}
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700"
          >
            {props.ctaLabel}
          </a>
        ) : null}
      </div>
      <div className="md:col-span-5">
        {props.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={props.imageUrl} alt="" className="w-full rounded-lg border border-gray-200" />
        ) : null}
      </div>
    </div>
  );
}


