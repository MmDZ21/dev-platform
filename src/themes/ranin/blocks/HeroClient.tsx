"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
  A11y,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button, Heading, Text, Container } from "../design-system";
import seLogo from "../assets/images/se-logo.svg"

type Slide = {
  image: string;
  headline: string;
  sub?: string;
  primaryHref?: string;
  secondaryHref?: string;
};

export default function HeroClient({ slides }: { slides: Slide[] }) {
  return (
    <section className="relative overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={800}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation
        pagination={{ clickable: true }}
        className="hero-swiper"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i} className="!h-full">
            <div className="relative h-full w-full">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${s.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/70" />
              {/* <div className="absolute inset-x-0 bottom-0 z-50 h-[80%] bg-gradient-to-b from-transparent via-transparent to-muted" /> */}
              <svg
                aria-hidden
                className="absolute -bottom-24 left-1/2 -translate-x-1/2 opacity-30 blur-2xl"
                width="1200"
                height="400"
              >
                <defs>
                  <radialGradient id="g" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <rect width="1200" height="400" fill="url(#g)" />
              </svg>

              <div className="relative text-white">
                <Container>
                  <div className="py-16 md:py-36">
                    <Text as="span" className="inline-flex items-center rounded-full border border-white/30 px-3 py-1 text-xs text-white/80">
                      تجهیزات برق صنعتی
                    </Text>
                    <Heading level={1} className="mt-4 text-2xl font-semibold leading-tight md:text-6xl">
                      {s.headline}
                    </Heading>
                    {s.sub && (
                      <Text className="mt-4 max-w-2xl text-sm md:text-base text-white/90 leading-relaxed">{s.sub}</Text>
                    )}
                    <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
                      <Button asChild className="w-full sm:w-auto">
                        <Link href={s.primaryHref ?? "/"}>بیشتر بدانید</Link>
                      </Button>
                      {s.secondaryHref && (
                        <Button variant="outline" asChild className="w-full sm:w-auto">
                          <Link href={s.secondaryHref} className="text-white border-white/60 hover:bg-white/10">تماس با ما</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </Container>
              </div>
            </div>
          </SwiperSlide>
        ))}
        {/* Trust bar overlay - positioned on top of slider */}
        <div className="absolute bottom-12 left-0 right-0 z-20 bg-transparent">
          <Container>
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-center gap-6 md:gap-10">
                <Image
                  src={seLogo}
                  alt="schneider electric"
                  width={300}
                  height={84}
                  className="h-18 w-auto opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
                />
            </div>
          </Container>
        </div>
      </Swiper>

      <style jsx global>{`
.hero-swiper {
  height: calc(100dvh - 6.5rem); /* full viewport minus header */
}
.hero-swiper .swiper-wrapper {
  height: 100%;
}
.hero-swiper .swiper-slide {
  height: 100%;
}

.swiper-button-prev,
.swiper-button-next {
  color: #fff;
  width: 42px;
  height: 42px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
}
.swiper-button-prev::after,
.swiper-button-next::after {
  font-size: 18px;
  font-weight: 700;
}
.swiper-pagination-bullet { background: rgba(255, 255, 255, 0.6); opacity: 1; }
.swiper-pagination-bullet-active { background: #fff; }

@media (max-width: 767px) {
  .hero-swiper .swiper-button-prev,
  .hero-swiper .swiper-button-next {
    top: auto;
    bottom: 1rem;
  }
}
`}</style>
    </section>
  );
}

