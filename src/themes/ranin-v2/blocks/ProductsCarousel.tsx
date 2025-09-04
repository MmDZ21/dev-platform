
"use client";

import { z } from "zod";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import {
  Button,
  Heading,
  Text,
  Section,
  Container,
  FullScreenSection,
  useEnterAnimation
} from "../design-system";
import Link from "next/link";
import ProductsCategoriesClient from "./ProductsCategoriesClient";

export const productsCategoriesSchema = z.object({
  title: z.string().default("محصولات ما"),
  subtitle: z.string().default("انواع تجهیزات برق صنعتی و ساختمانی با کیفیت و استاندارد"),
  ctaText: z.string().default("مشاهده همه محصولات"),
  ctaHref: z.string().default("/products"),
  fullScreen: z.boolean().default(true),
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

export function ProductsCarousel(props: z.infer<typeof productsCategoriesSchema> & { locale: string }) {
  const { title, subtitle, ctaText, ctaHref, categories, background } = props;
  const fullScreen = false; // Force fullscreen mode

  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.8,
  });

  const header = (
    <Container className="mb-8">
      <motion.div
        ref={ref}
        initial="offscreen"
        animate={animate}
        variants={variants.container}
      >
        <motion.div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" variants={variants.fadeInUp}>
          <motion.div className="flex-1" variants={variants.fadeInUp}>
            <Heading level={2} className="text-xl md:text-2xl font-semibold tracking-tight">
              {title}
            </Heading>
            <Text className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </Text>
          </motion.div>
          {/* Button visible only on desktop */}
          <motion.div variants={variants.fadeInUp} className="hidden sm:block">
            <Button variant="default" asChild className="w-auto">
              <Link href={ctaHref} className="flex items-center gap-2">
                {ctaText}
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Container>
  );

  const mobileButton = (
    <Container className="mt-8">
      <motion.div
        initial="offscreen"
        animate={animate}
        variants={variants.container}
      >
        <motion.div variants={variants.fadeInUp} className="sm:hidden flex justify-center">
          <Button variant="default" asChild className="w-full">
            <Link href={ctaHref} className="flex items-center justify-center gap-2">
              {ctaText}
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );

  const content = (
    <Container className={fullScreen ? "max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px]" : ""}>
      <motion.div
        initial="offscreen"
        animate={animate}
        variants={variants.container}
      >
        <motion.div variants={variants.fadeInUp} className="md:py-4">
          <ProductsCategoriesClient
            categories={categories}
            ctaText={ctaText}
            ctaHref={ctaHref}
          />
        </motion.div>
      </motion.div>
    </Container>
  );

  if (fullScreen) {
    return (
      <FullScreenSection background="default" align="start">
        <div className="w-full">
          {header}
          {content}
          {mobileButton}
        </div>
      </FullScreenSection>
    );
  }

  return (
    <Section className="bg-muted/20">
      <div className="py-8 md:py-10 lg:py-14">
        {header}
        {content}
        {mobileButton}
      </div>
    </Section>
  );
}
