"use client";

import { z } from "zod";
import { motion } from "motion/react";
import { Container, Heading, Section, useEnterAnimation } from "../design-system";

export const statsSectionSchema = z.object({
  title: z.string().default("سازمان ما"),
  stats: z
    .array(
      z.object({
        number: z.string(),
        label: z.string(),
      }),
    )
    .default([
      { number: "۱۰+", label: "اعضای تیم" },
      { number: "۱۰+", label: "سال تجربه" },
      { number: "۱۵+", label: "محصولات" },
      { number: "۱", label: "مکان" },
    ]),
  background: z
    .enum(["default", "muted", "gradient", "dark"])
    .default("default"),
});

export function StatsSection(
  props: z.infer<typeof statsSectionSchema> & { locale: string },
) {
  const { title, stats, background } = props;

  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.15,
    textDuration: 0.8,
  });

  return (
    <Section className="py-4 md:py-12 bg-gray-200">
      <motion.div
        ref={ref}
        initial="offscreen"
        animate={animate}
        variants={variants.container}
      >
        {/* Red Header */}
        <motion.div className="flex w-full items-center justify-center" variants={variants.fadeInUp}>
          <div className="w-full">
            <Container>
              <Heading level={2} className="text-center text-2xl font-bold">{title}</Heading>
            </Container>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="py-16" variants={variants.fadeInUp}>
          <Container>
            <motion.div className="grid grid-cols-2 gap-8 md:grid-cols-4" variants={variants.container}>
              {stats.map((stat, i) => (
                <motion.div key={i} className="text-center" variants={variants.scale}>
                  <motion.div className="text-brand mb-4 text-4xl font-bold md:text-6xl" variants={variants.fadeInUp}>
                    {stat.number}
                  </motion.div>
                  <motion.div className="text-muted-foreground text-lg font-semibold md:text-xl" variants={variants.fadeInUp}>
                    {stat.label}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </motion.div>
      </motion.div>
    </Section>
  );
}
