'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function SearchBox() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get('q') || '');

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(`/posts?q=${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={onSubmit} className="mb-6 flex">
      <input
        type="search"
        className="w-full border rounded-l px-3 py-2"
        placeholder="جستجو در مطالب..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-r"
      >
        جستجو
      </button>
    </form>
  );
}
