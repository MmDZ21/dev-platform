"use client";

import React, { useRef } from "react";
import {motion, useInView} from "motion/react";
import type { Variants } from "motion/react";
import Image from "next/image";
import { Heading, FullScreenSection } from "../design-system";

interface AnimatedFeaturesProps {
  /** Section title displayed at the top */
  sectionTitle?: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  /** Whether to reverse the layout (image on start, text on end) */
  reverse?: boolean;
  /** Background style */
  background?: "default" | "gray" | "gradient" | "dark";
  /** Custom class for the container */
  className?: string;
  /** Animation timing options */
  animationOptions?: {
    staggerDelay?: number;
    textDuration?: number;
    imageDuration?: number;
    viewportAmount?: number;
    viewportMargin?: string;
  };
}

const createContainerVariants = (staggerDelay: number): Variants => ({
  offscreen: {
    opacity: 0,
  },
  onscreen: {
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.8,
      staggerChildren: staggerDelay,
    },
  },
});

const createTextVariants = (duration: number): Variants => ({
  offscreen: {
    opacity: 0,
    y: 100,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration,
      staggerChildren: 0.4,
    },
  },
});

const createImageVariants = (duration: number, reverse: boolean): Variants => ({
  offscreen: {
    opacity: 0,
    x: reverse ? 100 : -100,
  },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      duration,
    },
  },
});

export function AnimatedFeatures({
  sectionTitle,
  title,
  description,
  imageSrc,
  imageAlt,
  reverse = false,
  background = "default",
  className = "",
  animationOptions = {},
}: AnimatedFeaturesProps) {
  const {
    staggerDelay = 0.4,
    textDuration = 1,
    imageDuration = 1.2,
    viewportAmount = 0.3,
    viewportMargin = "-100px 0px -50px 0px",
  } = animationOptions;
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: viewportAmount,
    margin: viewportMargin as any,
    once: true
  });

  const containerVariants = createContainerVariants(staggerDelay);
  const textVariants = createTextVariants(textDuration);
  const imageVariants = createImageVariants(imageDuration, reverse);

  const contentOrder = reverse ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row";
  const textPadding = reverse ? "md:ps-16" : "md:pe-8";

  return (
    <FullScreenSection
      background={background}
      align="center"
      padding="px-4 md:px-6 lg:px-8"
      className={className}
    >
      <motion.div 
        ref={ref}
        className={`mx-auto flex h-full w-full max-w-7xl items-center justify-between ${contentOrder} py-8 md:py-16`}
        initial="offscreen"
        animate={isInView ? "onscreen" : "offscreen"}
        variants={containerVariants}
      >
        
        <motion.div className={`flex-1 mb-8 md:mb-0 ${textPadding}`} variants={textVariants}>
          {sectionTitle && (
            <motion.div
              variants={textVariants}
              className="text-start mb-6 md:mb-8 flex gap-2 items-center"
            >
              <div className="w-4 h-0.5 bg-primary rounded-full flex-shrink-0" />
              <Heading
                level={6}
                className="text-xs font-bold md:text-sm lg:text-base text-brand"
              >
                {sectionTitle}
              </Heading>
            </motion.div>
          )}
          
          <motion.div variants={textVariants}>
            <Heading
              level={2}
              className="mb-4 md:mb-6 text-lg md:text-2xl lg:text-4xl font-bold leading-tight"
            >
              {title}
            </Heading>
          </motion.div>
          <motion.p 
            className="text-muted-foreground text-sm md:text-lg lg:text-xl leading-relaxed max-w-lg"
            variants={textVariants}
          >
            {description}
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="relative h-80 sm:h-96 md:h-[450px] lg:h-[500px] w-full md:flex-1 overflow-hidden rounded-xl"
          variants={imageVariants}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="relative z-10 object-cover rounded-xl"
          />
        </motion.div>
      </motion.div>
    </FullScreenSection>
  );
}

// Export the reusable component as default
export default AnimatedFeatures;
