import type { LayoutProps } from "@/cms/types";
import MainLayout from "./MainLayout";
import { Container, Section } from "../design-system";
import AnimatedFeatures from "@/themes/ranin/blocks/features";
import advice from "@/themes/ranin/assets/images/advice.png";
import delivery from "@/themes/ranin/assets/images/delivery.png";

export default function HomeLayout({ slots, page }: LayoutProps) {
  return (
    <MainLayout slots={slots} page={page}>
      {/* Hero Section */}
      {slots.hero && slots.hero.length > 0 && (
        <Section className="">{slots.hero}</Section>
      )}

      {/* Home Content Sections */}
      <div className="space-y-0">
        {/* First Animated Features Section */}
        <AnimatedFeatures
          sectionTitle="مشاوره تخصصی"
          title="مشاوره تخصصی خرید"
          description="با افتخار در کنار شما هستیم تا بهترین انتخاب را داشته باشید. تیم مشاوره تخصصی ما با تجربه‌ی سال‌ها فعالیت در حوزه تجهیزات برق صنعتی و ساختمانی، آماده است تا متناسب با نیاز دقیق شما—از ظرفیت جریان گرفته تا استانداردهای بین‌المللی—بهترین راهکارها را پیشنهاد دهد. مشاوران ما نه تنها در زمینه انواع کلیدها، ترانسفورماتورها و تابلوهای برق تخصص دارند، بلکه در مورد جدیدترین فناوری‌های روز دنیا نیز به‌روز هستند. با ما تماس بگیرید تا با مشاوره‌ای تخصصی و رایگان، بهترین تصمیم را برای پروژه‌ی خود بگیرید."
          imageSrc={advice.src}
          imageAlt="مشاوره تخصصی خرید"
          background="default"
        />

        {/* Second Animated Features Section - Reversed Layout */}
        <AnimatedFeatures
          sectionTitle="تحویل فوری"
          title="ارسال سریع"
          description="با سیستم ارسال سریع ما، فاصله‌ی بین سفارش تا دریافت محصول به حداقل می‌رسد. کافیست محصول مورد نظر خود را انتخاب کنید تا در کوتاه‌ترین زمان، بسته‌ی شما با بسته‌بندی ایمن و استاندارد، مستقیماً از انبار ما به دستتان برسد. سرعت، دقت و اطمینان سه اصل اساسی خدمات تحویل ما هستند. شبکه ارسال گسترده ما امکان تحویل سریع به تمام نقاط کشور را فراهم کرده و با پیگیری لحظه‌ای، همواره از وضعیت سفارش خود مطلع خواهید بود. همچنین امکان ارسال فوری برای سفارش‌های اورژانسی و پروژه‌های حساس نیز در دسترس شماست."
          imageSrc={delivery.src}
          imageAlt="ارسال سریع"
          reverse={true}
          background="gray"
        />

        {/* Parallax Section - using the CMS block */}
        {slots.parallax && slots.parallax.length > 0 && (
          <div className="parallax-break">{slots.parallax}</div>
        )}

        {/* Highlights */}
        {/* {slots.highlights && slots.highlights.length > 0 && (
          <Section>
            <Container className="py-10">{slots.highlights}</Container>
          </Section>
        )} */}

                {/* Additional Sections (like ProductsCarousel) */}
        {slots.sections && slots.sections.length > 0 && (
          <div className="space-y-0">{slots.sections}</div>
        )}

        {/* Newsletter Section */}
        {slots.newsletter && slots.newsletter.length > 0 && (
          <div className="newsletter-section">{slots.newsletter}</div>
        )}

        {/* Stats Section */}
        {/* {slots.stats && slots.stats.length > 0 && (
          <div className="stats-section">{slots.stats}</div>
        )} */}

        {/* Content if any */}
        {slots.content && slots.content.length > 0 && (
          <Section>
            <Container className="py-10">{slots.content}</Container>
          </Section>
        )}
      </div>
    </MainLayout>
  );
}
