"use client";

import React from "react";
import { useParams } from "next/navigation";
import { adminModelRegistry, adminModelRouterMap } from "@/modules/registry";
import AdminDataTable from "@/components/admin/AdminDataTable";

export default function AdminModelListPage() {
  const params = useParams<{ model: keyof typeof adminModelRegistry }>();
  const modelKey = params.model;
  const meta = adminModelRegistry[modelKey];
  const routerApi = adminModelRouterMap[modelKey];

  const { data, isLoading, refetch } = routerApi.getAll.useQuery(undefined);
  const deleteMutation = routerApi.delete.useMutation({ onSuccess: () => refetch() });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{meta.name}</h1>
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


