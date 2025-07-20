"use client";

import type { AdminModel, InferFieldValues } from "@/lib/admin/meta";
import { useState } from "react";

type AdminTableProps<T extends AdminModel> = {
  model: T;
  data: (InferFieldValues<T> & { id: string })[];
  onEdit?: (item: InferFieldValues<T> & { id: string }) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
  error?: string | null;
};

export function AdminTable<T extends AdminModel>({
  model,
  data,
  onEdit,
  onDelete,
  loading,
  error,
}: AdminTableProps<T>) {
  const fieldKeys = Object.keys(model.fields) as (keyof InferFieldValues<T>)[];
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 text-blue-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-10 text-red-600">
        {error}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-gray-500">
        <span className="mb-2 text-4xl">📦</span>
        <span>No items found.</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded border bg-gray-dark">
      <table className="min-w-[600px] w-full text-sm">
        <thead>
          <tr className="bg-gray-900">
            {fieldKeys.map((key) => (
              <th key={key as string} className="p-2 text-start capitalize">
                {model.fields[key as string].label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              {fieldKeys.map((key) => {
                const field = model.fields[key as string];
                const value = item[key];
                return (
                  <td key={key as string} className="p-2 align-middle">
                    {field.type === "image" && typeof value === "string" && value.trim() !== "" ? (
                      <img
                        src={value}
                        alt="thumbnail"
                        className="h-10 rounded border object-cover"
                      />
                    ) : field.type === "image" ? (
                      <span className="text-gray-400 italic">No Image</span>
                    ) : Array.isArray(value) ? (
                      <span>{value.join(", ")}</span>
                    ) : typeof value === "boolean" ? (
                      <span
                        className={
                          value
                            ? "rounded bg-green-100 px-2 py-0.5 text-green-700"
                            : "rounded bg-red-100 px-2 py-0.5 text-red-700"
                        }
                      >
                        {value ? "Yes" : "No"}
                      </span>
                    ) : (
                      String(value ?? "")
                    )}
                  </td>
                );
              })}
              {(onEdit || onDelete) && (
                <td className="space-x-2 p-2 whitespace-nowrap">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this item?"
                          )
                        ) {
                          setDeletingId(item.id);
                          onDelete(item.id);
                        }
                      }}
                      className="text-red-600 hover:underline"
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
