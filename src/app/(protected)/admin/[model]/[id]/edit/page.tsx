"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { adminModelRegistry, adminModelRouterMap } from "@/modules/registry";
import AdminForm from "@/components/admin/AdminForm";

export default function AdminModelEditPage() {
  const router = useRouter();
  const params = useParams<{ model: keyof typeof adminModelRegistry; id: string }>();
  const modelKey = params.model;
  const id = params.id;
  const meta = adminModelRegistry[modelKey];
  const routerApi = adminModelRouterMap[modelKey];

  const { data, isLoading } = routerApi.getById.useQuery({ id });
  const mutation = routerApi.update.useMutation({
    onSuccess: () => router.push(`/admin/${modelKey}`),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">ویرایش {meta.name}</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        {isLoading ? (
          <div className="text-gray-500">در حال بارگذاری...</div>
        ) : data ? (
          <AdminForm
            meta={meta}
            modelKey={modelKey}
            initial={data}
            onSubmit={async (values) => {
              await mutation.mutateAsync({ id, ...(values as any) });
            }}
            saving={mutation.isPending}
          />
        ) : (
          <div className="text-red-600">مورد یافت نشد</div>
        )}
      </div>
    </div>
  );
}


