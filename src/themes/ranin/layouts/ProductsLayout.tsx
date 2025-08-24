import type { LayoutProps } from "@/cms/types";

export default function ProductsLayout({ slots, page }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900" dir="rtl">
      {slots.nav}
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 text-2xl font-bold">{page.title}</div>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-8 px-4 py-10">
        <aside className="col-span-12 md:col-span-3 space-y-6">{slots.filters}</aside>
        <main className="col-span-12 md:col-span-9 space-y-6">{slots.content}</main>
      </div>
      <div className="mt-16">{slots.footer}</div>
    </div>
  );
}


