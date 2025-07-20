'use client';

import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc/client';

type BookFormProps = {
  initialBook?: {
    id: string;
    title: string;
    author: string;
  };
  onSuccess?: () => void;
};

export function BookForm({ initialBook, onSuccess }: BookFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const create = trpc.book.create.useMutation();
  const update = trpc.book.update.useMutation();

  // Refill form when editing
  useEffect(() => {
    if (initialBook) {
      setTitle(initialBook.title);
      setAuthor(initialBook.author);
    }
  }, [initialBook]);

  const handleSubmit = async () => {
    if (!title || !author) return;

    if (initialBook) {
      await update.mutateAsync({ id: initialBook.id, title, author });
    } else {
      await create.mutateAsync({ title, author });
    }

    setTitle('');
    setAuthor('');
    onSuccess?.();
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">
        {initialBook ? '✏️ Edit Book' : '➕ Add Book'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          placeholder="Title"
          className="border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Author"
          className="border p-2"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="col-span-full bg-blue-600 text-white px-4 py-2 rounded"
        >
          {initialBook ? 'Update Book' : 'Create Book'}
        </button>
      </div>
    </div>
  );
}
