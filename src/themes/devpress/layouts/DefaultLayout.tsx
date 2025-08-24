import type { LayoutProps } from "@/cms/types";

export default function DefaultLayout({ slots, page }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="mx-auto w-full max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold">{page.title}</h1>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4">
        {slots.hero && slots.hero.length > 0 && (
          <section className="mb-10">{slots.hero}</section>
        )}
        {slots.content && slots.content.length > 0 && (
          <section className="space-y-6">{slots.content}</section>
        )}
      </main>
      <footer className="mx-auto w-full max-w-5xl px-4 py-10 text-sm text-gray-500">
        © DevPress Sample Theme
      </footer>
    </div>
  );
}


