"use client";
import { useParams, useRouter } from "next/navigation";
import {
  adminModelRegistry,
  adminModelRouterMap,
  type AdminModelKey,
} from "@/modules/registry";
import { AdminTable } from "@/components/admin/shared/AdminTable";
import { normalizeItem } from "@/lib/admin/normalize";
import Link from "next/link";

type RawItem = { id: string } & Record<string, unknown>;

export default function AdminDynamicPage() {
  const params = useParams();
  const router = useRouter();
  const raw = params.model;
  const modelKey = Array.isArray(raw) ? raw[0] : raw;

  // اگر کلید اشتباه یا ناشناخته است
  if (!modelKey || !(modelKey in adminModelRegistry)) {
    return <p className="p-6 text-red-600">❌ Unknown model: {modelKey}</p>;
  }

  const meta = adminModelRegistry[modelKey as AdminModelKey];
  const trpcRouter = adminModelRouterMap[modelKey as AdminModelKey];

  // tRPC query و mutation داینامیک
  const { data = [], refetch, isLoading } = trpcRouter.getAll.useQuery();
  const del = trpcRouter.delete.useMutation();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📋 مدیریت {meta.name}</h1>
        <Link href={`/admin/${modelKey}/new`} className="btn btn-primary">
          افزودن {meta.name}
        </Link>
      </div>
      <AdminTable
        model={meta}
        data={data.map((item: RawItem) => normalizeItem(item, meta))}
        onEdit={(item) => router.push(`/admin/${modelKey}/${item.id}/edit`)}
        onDelete={async (id) => {
          if (confirm(`آیا مطمئن هستید که این ${meta.name} حذف شود؟`)) {
            await del.mutateAsync({ id });
            refetch();
          }
        }}
        loading={isLoading}
      />
    </div>
  );
}
