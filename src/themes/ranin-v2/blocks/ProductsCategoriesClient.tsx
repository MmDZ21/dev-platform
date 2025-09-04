"use client";

import Link from "next/link";
import Image from "next/image";
import relayImage from "../assets/images/relay.png";

// Icon components for products
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

export interface Category {
  title: string;
  description: string;
  icon: "plug" | "lightning" | "shield";
  categoryHref: string;
  productCount?: string;
}

interface ProductsCategoriesClientProps {
  categories: Category[];
  ctaText: string;
  ctaHref: string;
}

export default function ProductsCategoriesClient({
  categories,
  ctaText,
  ctaHref,
}: ProductsCategoriesClientProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, i) => {
          const IconComponent = iconMap[category.icon];
          return (
            <div
            key={i}
            >
              <Link href={category.categoryHref}>
                <div className="relative h-64 w-full rounded-xl overflow-hidden cursor-pointer group">
                  {/* Background Image */}
                  <Image
                    src={relayImage}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Overlay with text */}
                  <div className="absolute inset-0 bg-black/70 group-hover:bg-black/80 transition-all duration-300" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2 leading-tight">
                      {category.title}
                    </h3>
                    <p className="text-sm text-white/90 line-clamp-1">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
