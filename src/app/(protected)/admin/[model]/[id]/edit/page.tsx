"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { adminModelRegistry } from "@/modules/registry";
import { adminModelRouterMap } from "@/modules/adminRouterMap.client";
import AdminForm from "@/components/admin/AdminForm";
import { useMemo } from "react";
import { trpc } from "@/lib/trpc/client";

export default function AdminModelEditPage() {
  const router = useRouter();
  const params = useParams<{ model: keyof typeof adminModelRegistry; id: string }>();
  const modelKey = params.model;
  const id = params.id;
  const meta = adminModelRegistry[modelKey];
  const routerApi = adminModelRouterMap[modelKey] as any;

  const { data, isLoading } = routerApi.getById.useQuery({ id });
  const mutation = routerApi.update.useMutation({
    onSuccess: () => router.push(`/admin/${modelKey}`),
  });

  const isProduct = modelKey === 'product';
  const specsQuery = isProduct && data?.id ? (trpc.productSpec.getByProduct as any).useQuery({ productId: data.id }) : null;
  const productId = data?.id;

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

      {isProduct && productId && (
        <InlineSpecsEditor productId={productId} />
      )}
    </div>
  );
}

function InlineSpecsEditor({ productId }: { productId: string }) {
  const specs = (trpc.productSpec.getByProduct as any).useQuery({ productId });
  const create = (trpc.productSpec.create as any).useMutation({ onSuccess: () => specs.refetch() });
  const update = (trpc.productSpec.update as any).useMutation({ onSuccess: () => specs.refetch() });
  const remove = (trpc.productSpec.delete as any).useMutation({ onSuccess: () => specs.refetch() });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">مشخصات فنی</h2>
        <button
          className="rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white"
          onClick={async () => {
            await create.mutateAsync({ productId, key: "", value: "", unit: "", order: (specs.data?.length ?? 0) + 1 });
          }}
        >
          + افزودن
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-800">
          <thead>
            <tr>
              <th className="px-3 py-2 text-start">کلید</th>
              <th className="px-3 py-2 text-start">مقدار</th>
              <th className="px-3 py-2 text-start">واحد</th>
              <th className="px-3 py-2 text-start">ترتیب</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {(specs.data ?? []).map((s: any) => (
              <tr key={s.id}>
                <td className="px-3 py-1">
                  <input className="w-full rounded border border-gray-200 px-2 py-1 text-sm dark:border-gray-800 dark:bg-gray-900" defaultValue={s.key}
                    onBlur={(e) => update.mutate({ id: s.id, key: e.target.value, value: s.value, unit: s.unit ?? "", order: s.order ?? 0 })} />
                </td>
                <td className="px-3 py-1">
                  <input className="w-full rounded border border-gray-200 px-2 py-1 text-sm dark:border-gray-800 dark:bg-gray-900" defaultValue={s.value}
                    onBlur={(e) => update.mutate({ id: s.id, key: s.key, value: e.target.value, unit: s.unit ?? "", order: s.order ?? 0 })} />
                </td>
                <td className="px-3 py-1">
                  <input className="w-full rounded border border-gray-200 px-2 py-1 text-sm dark:border-gray-800 dark:bg-gray-900" defaultValue={s.unit ?? ""}
                    onBlur={(e) => update.mutate({ id: s.id, key: s.key, value: s.value, unit: e.target.value, order: s.order ?? 0 })} />
                </td>
                <td className="px-3 py-1">
                  <input type="number" className="w-24 rounded border border-gray-200 px-2 py-1 text-sm dark:border-gray-800 dark:bg-gray-900" defaultValue={s.order ?? 0}
                    onBlur={(e) => update.mutate({ id: s.id, key: s.key, value: s.value, unit: s.unit ?? "", order: Number(e.target.value) })} />
                </td>
                <td className="px-3 py-1 text-end">
                  <button className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 dark:border-red-900"
                    onClick={() => remove.mutate({ id: s.id })}
                  >حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


