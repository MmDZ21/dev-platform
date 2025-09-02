"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { adminModelRegistry } from "@/modules/registry";
import { adminModelRouterMap } from "@/modules/adminRouterMap.client";
import AdminForm from "@/components/admin/AdminForm";

export default function AdminModelNewPage() {
  const router = useRouter();
  const params = useParams<{ model: keyof typeof adminModelRegistry }>();
  const modelKey = params.model;
  const meta = adminModelRegistry[modelKey];
  const routerApi = adminModelRouterMap[modelKey] as any;

  const mutation = routerApi.create.useMutation({
    onSuccess: () => router.push(`/admin/${modelKey}`),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">ایجاد {meta.name}</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <AdminForm
          meta={meta}
          modelKey={modelKey}
          onSubmit={async (values) => {
            await mutation.mutateAsync(values as any);
          }}
          saving={mutation.isPending}
        />
      </div>
    </div>
  );
}


