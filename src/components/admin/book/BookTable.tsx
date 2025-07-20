'use client';

import { trpc } from '@/lib/trpc/client';

type Book = {
  id: string;
  title: string;
  author: string;
};

export function BookTable({
  onEdit,
}: {
  onEdit: (book: Book) => void;
}) {
  const books = trpc.book.getAll.useQuery();
  const deleteBook = trpc.book.delete.useMutation();

  const handleDelete = async (id: string) => {
    await deleteBook.mutateAsync(id);
    books.refetch();
  };

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-lg font-semibold">📖 Books List</h2>
      <ul className="space-y-2">
        {books.data?.map((book) => (
          <li
            key={book.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div>
              <strong>{book.title}</strong> by {book.author}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => onEdit(book)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(book.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
