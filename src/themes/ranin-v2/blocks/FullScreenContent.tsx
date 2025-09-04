"use client";

import { z } from "zod";
import { motion } from "motion/react";
import { Heading, Text, Button, FullScreenSection, Container, useEnterAnimation } from "../design-system/";
import Link from "next/link";

export const fullScreenContentSchema = z.object({
  title: z.string().default("Full Screen Section"),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
  background: z.enum(["default", "gray", "gradient", "dark"]).default("gradient"),
  align: z.enum(["start", "center", "end"]).default("center"),
  textAlign: z.enum(["left", "center", "right"]).default("center"),
});

export function FullScreenContent(props: z.infer<typeof fullScreenContentSchema> & { locale: string }) {
  const { title, subtitle, content, ctaText, ctaHref, background, align, textAlign } = props;
  
  const textAlignClass = textAlign === "center" ? "text-center" : textAlign === "right" ? "text-right" : "text-left";
  
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.8,
  });
  
  return (
    <FullScreenSection background={background} align={align}>
      <Container className={`max-w-4xl xl:max-w-5xl 2xl:max-w-6xl ${textAlignClass}`}>
        <motion.div 
          ref={ref}
          className="space-y-6"
          initial="offscreen"
          animate={animate}
          variants={variants.container}
        >
          <motion.div variants={variants.fadeInUp}>
            <Heading level={1} className="text-4xl md:text-6xl font-bold">
              {title}
            </Heading>
          </motion.div>
          
          {subtitle && (
            <motion.div variants={variants.fadeInUp}>
              <Text className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                {subtitle}
              </Text>
            </motion.div>
          )}
          
          {content && (
            <motion.div variants={variants.fadeInUp}>
              <Text className="text-lg max-w-2xl mx-auto leading-relaxed">
                {content}
              </Text>
            </motion.div>
          )}
          
          {ctaText && ctaHref && (
            <motion.div className="pt-4" variants={variants.fadeInUp}>
              <Button size="lg" asChild>
                <Link href={ctaHref}>
                  {ctaText}
                </Link>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </FullScreenSection>
  );
}
