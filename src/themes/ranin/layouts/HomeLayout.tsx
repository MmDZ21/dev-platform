import type { LayoutProps } from "@/cms/types";

export default function HomeLayout({ slots }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900" dir="rtl">
      {slots.nav}

      {/* Hero */}
      <section className="border-b border-gray-200">
        <div className="mx-auto w-full max-w-7xl px-4 py-12">{slots.hero}</div>
      </section>

      {/* Promo grid / Cards */}
      <main className="mx-auto w-full max-w-7xl px-4 py-12 space-y-12">
        {slots.highlights}
        {slots.sections}
      </main>

      <div className="mt-16">{slots.footer}</div>
    </div>
  );
}


