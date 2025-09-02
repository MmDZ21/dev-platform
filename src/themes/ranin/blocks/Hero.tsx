import { z } from "zod";
import HeroClient from "./HeroClient";
import slide1 from "../assets/images/slide-1.jpg";
import slide2 from "../assets/images/slide-2.jpg";
import slide3 from "../assets/images/slide-3.jpg";

const relativePath = z.string().regex(/^\//, "must start with /");

export const heroSchema = z.object({
  slides: z.array(
    z.object({
      image: z.string().min(1),
      headline: z.string().min(1),
      sub: z.string().optional(),
      primaryHref: z.union([z.string().url(), relativePath]).optional(),
      secondaryHref: z.union([z.string().url(), relativePath]).optional(),
    }),
  ).optional(),
});

export function Hero(props: z.infer<typeof heroSchema>) {
  const defaultSlides = [
    {
      image: slide1.src,
      headline: "تجهیزات برق صنعتی و ساختمانی",
      sub: "ارائه بهترین کلیدها، ترانسفورماتورها و تابلوهای برق با استانداردهای بین‌المللی و کیفیت برتر.",
      primaryHref: "/products",
      secondaryHref: "/contact",
    },
    {
      image: slide2.src,
      headline: "مشاوره تخصصی و خدمات فنی",
      sub: "تیم مجرب ما آماده ارائه مشاوره رایگان و پشتیبانی کامل در انتخاب بهترین تجهیزات برای پروژه شماست.",
      primaryHref: "/about",
      secondaryHref: "/contact",
    },
    {
      image: slide3.src,
      headline: "سرعت در تحویل و کیفیت مطمئن",
      sub: "با شبکه توزیع گسترده و انبارداری مدرن، محصولات با سرعت و دقت بالا به دست شما می‌رسد.",
      primaryHref: "/services",
      secondaryHref: "/contact",
    },
  ];
  const slides = props.slides ?? defaultSlides;
  return <HeroClient slides={slides} />;
}
