"use client";
import { AdminForm } from "@/components/admin/shared/AdminForm";
import { postMeta } from "@/modules/blog/postMeta";
import { trpc } from "@/lib/trpc/client";
import { useParams, useRouter } from "next/navigation";
import { AdminModelKey, adminModelRegistry, adminModelRouterMap } from "@/modules/registry";

export default function NewAdminItemPage() {
  const params = useParams();
  const router = useRouter();

  const raw = params.model;
  const modelKey = Array.isArray(raw) ? raw[0] : raw;

  // اگر مدل معتبر نبود
  if (!modelKey || !(modelKey in adminModelRegistry)) {
    return <p className="p-6 text-red-600">مدل نامعتبر!</p>;
  }

  const meta = adminModelRegistry[modelKey as AdminModelKey];
  const trpcRouter = adminModelRouterMap[modelKey as AdminModelKey];
  const create = trpcRouter.create.useMutation();

  const handleSubmit = async (data: any) => {
    await create.mutateAsync(data);
    router.push(`/admin/${modelKey}`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">افزودن {meta.name} جدید</h1>
      <AdminForm
        model={meta}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
