"use client";

import React from "react";
import { useParams } from "next/navigation";
import { adminModelRegistry } from "@/modules/registry";
import { adminModelRouterMap } from "@/modules/adminRouterMap.client";
import { trpc } from "@/lib/trpc/client";
import AdminDataTable from "@/components/admin/AdminDataTable";

export default function AdminModelListPage() {
  const params = useParams<{ model: keyof typeof adminModelRegistry }>();
  const modelKey = params.model;
  const meta = adminModelRegistry[modelKey];
  const routerApi = adminModelRouterMap[modelKey];

  const { data, isLoading, refetch } = (routerApi as any).getAll.useQuery(undefined, {
    staleTime: 1000,
  });
  const deleteMutation = (routerApi as any).delete.useMutation({ onSuccess: () => refetch() });
  const exportLeads = trpc.lead.getAll.useQuery(undefined, { enabled: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{meta.name}</h1>
        <div className="flex items-center gap-2">
        {modelKey === 'product' && (
          <a
            href={`/admin/${modelKey}/bulk-import`}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 hover:border-brand-400 dark:border-gray-800 dark:bg-gray-900"
          >
            درون‌ریزی گروهی
          </a>
        )}
        {modelKey === 'lead' && (
          <button
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 hover:border-brand-400 dark:border-gray-800 dark:bg-gray-900"
            onClick={async () => {
              const res = await exportLeads.refetch();
              const rows = (res.data as any[]) ?? [];
              const header = ['id','name','phone','email','message','productId','createdAt'];
              const csv = [header.join(',')].concat(rows.map((r:any)=> header.map(h=> JSON.stringify((r as any)[h] ?? '')).join(','))).join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'leads.csv'; a.click(); URL.revokeObjectURL(url);
            }}
          >
            خروجی CSV
          </button>
        )}
        </div>
      </div>

      <AdminDataTable
        modelKey={modelKey}
        meta={meta}
        data={data ?? []}
        isLoading={isLoading}
        onDelete={async (id) => {
          await deleteMutation.mutateAsync({ id });
        }}
        onBulkDelete={async (ids) => {
          for (const id of ids) {
            await deleteMutation.mutateAsync({ id });
          }
          await refetch();
        }}
      />
    </div>
  );
}


