import { z } from "zod";
import parallaxImage from "../assets/images/parallax.png";
import { Button } from "../design-system";
import Link from "next/link";

export const parallaxSectionSchema = z.object({
  image: z.string().min(1, "Image URL is required").default(parallaxImage.src),
  height: z.enum(["small", "medium", "large", "full"]).default("medium"),
  overlay: z.boolean().default(true),
  overlayOpacity: z.number().min(0).max(1).default(0.7),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
  textAlign: z.enum(["left", "center", "right"]).default("center"),
  textColor: z.enum(["white", "black", "inherit"]).default("white"),
});

export function ParallaxSection(
  props: z.infer<typeof parallaxSectionSchema> & { locale: string },
) {
  const {
    image,
    height,
    overlay,
    overlayOpacity,
    title,
    subtitle,
    ctaText,
    ctaHref,
    textAlign,
    textColor,
  } = props;

  const heightClasses = {
    small: "h-[20vh] md:h-[30vh]",
    medium: "h-[30vh] md:h-[50vh]",
    large: "h-[50vh] md:h-[70vh]",
    full: "h-screen",
  };

  const textAlignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const textColorClasses = {
    white: "text-white",
    black: "text-black",
    inherit: "text-inherit",
  };

  const hasContent = title || subtitle || ctaText;

  return (
    <section
      className={`relative ${heightClasses[height]} flex items-center justify-center bg-cover bg-fixed bg-center`}
      style={{ backgroundImage: `url('${image}')` }}
    >
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-800/70 to-gray-700/70"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {hasContent && (
        <div
          className={`relative z-10 mx-auto max-w-4xl px-4 md:px-6 ${textAlignClasses[textAlign]} ${textColorClasses[textColor]}`}
        >
          {title && (
            <h2 className="mb-4 text-2xl leading-tight font-bold md:text-5xl">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mx-auto mb-6 md:mb-8 max-w-2xl text-sm md:text-xl opacity-90 leading-relaxed">
              {subtitle}
            </p>
          )}

          {ctaText && ctaHref && (
            <Button
              asChild
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Link href={ctaHref}>{ctaText}</Link>
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
