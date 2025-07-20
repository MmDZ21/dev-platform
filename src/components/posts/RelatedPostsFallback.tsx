// components/posts/RelatedPostsFallback.tsx
export function RelatedPostsFallback() {
  return (
    <section className="mt-12">
      <h3 className="mb-4 text-lg font-bold">مطالب مرتبط</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded bg-gray-100 dark:bg-zinc-800"
          />
        ))}
      </div>
    </section>
  );
}
