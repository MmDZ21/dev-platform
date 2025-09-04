"use client";

import { z } from "zod";
import { motion } from "motion/react";
import { Card, CardBody, CardHeader, Heading, Text, FullScreenSection, Container, useEnterAnimation } from "../design-system";

export const highlightCardsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  items: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      href: z.string().optional(),
    })
  ).default([]),
  columns: z.number().int().min(1).max(4).default(3),
  fullScreen: z.boolean().default(false),
  background: z.enum(["default", "gray", "gradient", "dark"]).default("default"),
});

export function HighlightCards(props: z.infer<typeof highlightCardsSchema> & { locale: string }) {
  const { title, subtitle, items, columns, fullScreen, background } = props;
  const cols = Math.min(4, Math.max(1, columns));
  const cls = cols === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : cols === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1";
  
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.8,
  });
  
  const content = (
    <Container className={fullScreen ? "max-w-6xl xl:max-w-[1300px] 2xl:max-w-[1500px]" : ""}>
      <motion.div
        ref={ref}
        initial="offscreen"
        animate={animate}
        variants={variants.container}
      >
        {(title || subtitle) && (
          <motion.div className="mb-8 text-center" variants={variants.fadeInUp}>
            {title && (
              <motion.div variants={variants.fadeInUp}>
                <Heading level={2} className="text-3xl font-bold mb-4">
                  {title}
                </Heading>
              </motion.div>
            )}
            {subtitle && (
              <motion.div variants={variants.fadeInUp}>
                <Text className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {subtitle}
                </Text>
              </motion.div>
            )}
          </motion.div>
        )}
        
        <motion.div className={`grid ${cls} gap-6`} variants={variants.fadeInUp}>
          {items.map((it, idx) => (
            <motion.a 
              key={idx} 
              href={it.href || "#"} 
              className="block hover:shadow-lg transition-shadow"
              variants={variants.scale}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="text-lg font-semibold text-foreground">{it.title}</div>
                </CardHeader>
                {it.description ? (
                  <CardBody>
                    <Text className="mt-0 text-sm">{it.description}</Text>
                  </CardBody>
                ) : null}
              </Card>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </Container>
  );

  if (fullScreen) {
    return (
      <FullScreenSection background={background} align="center">
        {content}
      </FullScreenSection>
    );
  }

  return content;
}


