"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Button, Text, Card, CardBody, CardFooter } from "../design-system";

const Plug = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 8H3m4 8H3m10-4h4m-4 4h4m-4-8h4m-4.5-3.5a2.5 2.5 0 015 0v3a2.5 2.5 0 01-5 0v-3z" />
  </svg>
);
const Lightning = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const ShieldCheck = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const ArrowRight = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const iconMap = {
  plug: Plug,
  lightning: Lightning,
  shield: ShieldCheck,
} as const;

export type Product = {
  title: string;
  description: string;
  icon: keyof typeof iconMap;
  learnMoreHref: string;
  compareHref: string;
};

export function ProductCardClient({ product }: { product: Product }) {
  const Icon = iconMap[product.icon];
  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card data-testid="product-card" className="group overflow-hidden w-full h-fit">
        <CardBody className="pt-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="mb-1 text-sm font-medium truncate">{product.title}</div>
              <Text className="text-sm text-muted-foreground line-clamp-1">{product.description}</Text>
            </div>
            <div className="rounded-xl border p-2 shadow-sm flex-shrink-0 ml-2">
              <Icon className="h-5 w-5" />
            </div>
          </div>
          
          {/* Product Image */}
          <div className="mt-auto mb-4">
            <div className="h-80 w-full rounded-xl overflow-hidden bg-gray-50 border">
              <Image
                src="/images/relay.png"
                alt={product.title}
                width={200}
                height={320}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-full w-full object-cover p-2"
                loading="lazy"
              />
            </div>
          </div>
        </CardBody>
        <CardFooter className="pt-4 border-t bg-muted/10">
          <div className="flex w-full items-center justify-between text-sm">
            <Link
              className="inline-flex items-center gap-1 hover:underline transition-colors font-medium"
              href={product.learnMoreHref}
            >
              بیشتر بدانید <ArrowRight className="h-4 w-4" />
            </Link>
            <Button variant="default" size="sm" className="rounded-full" asChild>
              <Link href={product.compareHref}>مقایسه</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
