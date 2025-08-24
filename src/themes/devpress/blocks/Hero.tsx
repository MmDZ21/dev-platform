import { z } from "zod";
import { cn } from "@/lib/utils";

export const heroSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().url().optional(),
  align: z.enum(["start", "center", "end"]).default("start"),
});

export async function HeroBlock(props: z.infer<typeof heroSchema> & { locale: string }) {
  const alignment =
    props.align === "center"
      ? "items-center text-center"
      : props.align === "end"
        ? "items-end text-right"
        : "items-start text-start";
  return (
    <div className={cn("flex flex-col gap-4 py-12", alignment)}>
      <h2 className="text-3xl font-extrabold leading-tight">{props.title}</h2>
      {props.subtitle ? (
        <p className="max-w-2xl text-base text-gray-600">{props.subtitle}</p>
      ) : null}
      {props.ctaHref && props.ctaLabel ? (
        <a
          href={props.ctaHref}
          className="inline-flex w-max items-center justify-center rounded-md bg-gray-900 px-5 py-2 text-white hover:bg-gray-700"
        >
          {props.ctaLabel}
        </a>
      ) : null}
    </div>
  );
}


