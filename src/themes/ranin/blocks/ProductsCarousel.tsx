
import { z } from "zod";
import {
  Button,
  Heading,
  Text,
  Section,
  Container,
  FullScreenSection
} from "../design-system";
import Link from "next/link";
import ProductsCategoriesClient from "./ProductsCategoriesClient";

export const productsCategoriesSchema = z.object({
  title: z.string().default("محصولات ما"),
  subtitle: z.string().default("انواع تجهیزات برق صنعتی و ساختمانی با کیفیت و استاندارد برتر."),
  ctaText: z.string().default("مشاهده همه محصولات"),
  ctaHref: z.string().default("/products"),
  fullScreen: z.boolean().default(false),
  background: z.enum(["default", "muted", "gradient", "dark"]).default("muted"),
  categories: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.enum(["plug", "lightning", "shield"]).default("plug"),
    categoryHref: z.string().default("/products"),
    productCount: z.string().optional(),
  })).default([
    {
      title: "کلیدهای مینیاتوری و اتوماتیک",
      description: "انواع کلیدهای MCB، MCCB و کلیدهای اتوماتیک برای حفاظت مدارهای برق.",
      icon: "plug" as const,
      categoryHref: "/products?category=circuit-breakers",
      productCount: "۲۵+ محصول",
    },
    {
      title: "ترانسفورماتور و تجهیزات قدرت",
      description: "ترانسفورماتورهای توزیع، قدرت و کنترل برای صنایع مختلف.",
      icon: "lightning" as const,
      categoryHref: "/products?category=transformers",
      productCount: "۱۸+ محصول",
    },
    {
      title: "تابلوهای برق و کنترل",
      description: "تابلوهای توزیع، کنترل و محافظت برای انواع کاربردهای صنعتی.",
      icon: "shield" as const,
      categoryHref: "/products?category=control-panels",
      productCount: "۳۰+ محصول",
    },
  ]),
});

export async function ProductsCarousel(props: z.infer<typeof productsCategoriesSchema> & { locale: string }) {
  const { title, subtitle, ctaText, ctaHref, categories, fullScreen, background } = props;

  const content = (
    <Container className={fullScreen ? "max-w-7xl" : ""}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex-1">
          <Heading level={2} className="text-xl md:text-2xl font-semibold tracking-tight">
            {title}
          </Heading>
          <Text className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </Text>
        </div>
        <Button variant="default" asChild className="w-full sm:w-auto">
          <Link href={ctaHref}>
            {ctaText}
          </Link>
        </Button>
      </div>

      <ProductsCategoriesClient
        categories={categories}
        ctaText={ctaText}
        ctaHref={ctaHref}
      />
    </Container>
  );

  if (fullScreen) {
    return (
      <FullScreenSection background="default" align="center">
        {content}
      </FullScreenSection>
    );
  }

  return (
    <Section className="bg-muted/20">
      <div className="py-14">
        {content}
      </div>
    </Section>
  );
}
