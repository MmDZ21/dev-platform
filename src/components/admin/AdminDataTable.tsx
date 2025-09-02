"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { AdminModel } from "@/lib/admin/meta";

type AdminDataTableProps = {
  modelKey: string;
  meta: AdminModel;
  data: any[];
  isLoading?: boolean;
  onDelete?: (id: string) => Promise<void> | void;
  onBulkDelete?: (ids: string[]) => Promise<void> | void;
};

function toDisplay(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "✓" : "✗";
  if (Array.isArray(value)) {
    // Join array of strings/objects
    if (value.length === 0) return "";
    if (typeof value[0] === "string") return (value as string[]).join(", ");
    try {
      return value
        .map((v: any) => (typeof v === "object" && v !== null ? v.name ?? v.title ?? v.id ?? "" : String(v)))
        .filter(Boolean)
        .join(", ");
    } catch {
      return String(value.length);
    }
  }
  if (typeof value === "object") {
    const obj = value as Record<string, any>;
    return obj.name ?? obj.title ?? obj.slug ?? obj.id ?? JSON.stringify(obj);
  }
  return String(value);
}

export default function AdminDataTable({ modelKey, meta, data, isLoading, onDelete, onBulkDelete }: AdminDataTableProps) {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const cols: ColumnDef<any>[] = [
      {
        id: "select",
        header: ({ table }) => {
          const allSelected = table.getRowModel().rows.length > 0 && table.getRowModel().rows.every((r) => selectedIds[r.original.id]);
          const someSelected = table.getRowModel().rows.some((r) => selectedIds[r.original.id]);
          return (
            <input
              type="checkbox"
              aria-label="select all"
              className="size-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = !allSelected && someSelected;
              }}
              onChange={(e) => {
                const next: Record<string, boolean> = { ...selectedIds };
                table.getRowModel().rows.forEach((row) => {
                  next[row.original.id] = e.target.checked;
                });
                setSelectedIds(next);
              }}
            />
          );
        },
        cell: ({ row }) => (
          <input
            type="checkbox"
            aria-label="select row"
            className="size-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            checked={!!selectedIds[row.original.id]}
            onChange={(e) => setSelectedIds((prev) => ({ ...prev, [row.original.id]: e.target.checked }))}
          />
        ),
        size: 36,
      },
    ];

    // Auto-generate data columns from meta. Limit to first 6 columns for readability.
    const fieldEntries = Object.entries(meta.fields).slice(0, 6);
    for (const [key, schema] of fieldEntries) {
      cols.push({
        accessorKey: key,
        header: () => (
          <div className="text-start text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{schema.label ?? key}</div>
        ),
        cell: ({ row, getValue }) => (
          <div className="text-sm text-gray-700 dark:text-gray-300">{toDisplay(getValue())}</div>
        ),
      });
    }

    // Actions column
    cols.push({
      id: "actions",
      header: () => <span className="text-xs uppercase text-gray-500 dark:text-gray-400">عملیات</span>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/${modelKey}/${row.original.id}/edit`}
            className="inline-flex items-center rounded border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 hover:border-brand-400 hover:text-brand-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
          >
            ویرایش
          </Link>
          {onDelete && (
            <button
              className="inline-flex items-center rounded border border-red-200 bg-white px-2.5 py-1 text-xs text-red-600 hover:border-red-400 dark:border-red-900 dark:bg-gray-900"
              onClick={async () => {
                if (!confirm("حذف این مورد؟")) return;
                await onDelete(row.original.id);
              }}
            >
              حذف
            </button>
          )}
        </div>
      ),
      size: 120,
    });

    return cols;
  }, [meta, modelKey, onDelete, selectedIds]);

  const filteredData = useMemo(() => {
    const q = globalFilter.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) => {
      // Search across primitive field values and a few known keys
      const values: string[] = [];
      for (const [key] of Object.entries(meta.fields)) {
        values.push(toDisplay(row[key]));
      }
      values.push(toDisplay(row["id"]))
      values.push(toDisplay(row["slug"]))
      values.push(toDisplay(row["sku"]))
      return values.some((v) => v.toLowerCase().includes(q));
    });
  }, [data, meta.fields, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedIdList = useMemo(() => Object.keys(selectedIds).filter((id) => selectedIds[id]), [selectedIds]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="جستجو..."
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 sm:w-80"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <Link
            href={`/admin/${modelKey}/new`}
            className="inline-flex items-center rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            + مورد جدید
          </Link>
        </div>
        {selectedIdList.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">{selectedIdList.length} انتخاب شده</span>
            {onBulkDelete && (
              <button
                className="inline-flex items-center rounded-md border border-red-200 bg-white px-3 py-2 text-sm text-red-600 hover:border-red-400 dark:border-red-900 dark:bg-gray-900"
                onClick={async () => {
                  if (!confirm("حذف گروهی موارد انتخاب‌شده؟")) return;
                  await onBulkDelete(selectedIdList);
                  setSelectedIds({});
                }}
              >
                حذف گروهی
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-950">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3 py-3 text-start font-medium text-gray-500">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={columns.length}>در حال بارگذاری...</td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={columns.length}>موردی یافت نشد</td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-950/60">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 align-middle text-gray-700 dark:text-gray-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {table.getRowModel().rows.length} نتیجه پس از فیلتر
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            « اول
          </button>
          <button
            className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹ قبلی
          </button>
          <span className="text-xs text-gray-600 dark:text-gray-300">
            صفحه {table.getState().pagination.pageIndex + 1} از {table.getPageCount() || 1}
          </span>
          <button
            className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            بعدی ›
          </button>
          <button
            className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            آخر »
          </button>
          <select
            className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} در صفحه
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}


