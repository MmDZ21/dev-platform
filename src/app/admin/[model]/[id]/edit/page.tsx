"use client";
import { useParams, useRouter } from "next/navigation";
import { AdminForm } from "@/components/admin/shared/AdminForm";
import { adminModelRegistry, adminModelRouterMap } from "@/modules/registry";
// import type { AdminModelKey } from "@/modules/registry"; // لازم نیست اگر TS خطا نداد

export default function EditAdminItemPage() {
  const params = useParams();
  const router = useRouter();

  const rawModel = params.model;
  const modelKey = Array.isArray(rawModel) ? rawModel[0] : rawModel;
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!id) return <div className="p-6 text-red-600">شناسه نامعتبر!</div>;
  // بررسی اعتبار مدل
  if (!modelKey || !(modelKey in adminModelRegistry)) {
    return <div className="p-6 text-red-600">مدل نامعتبر!</div>;
  }

  const meta = adminModelRegistry[modelKey as keyof typeof adminModelRegistry];
  const trpcRouter =
    adminModelRouterMap[modelKey as keyof typeof adminModelRouterMap];

  // دیتا
  const { data, isLoading } = trpcRouter.getById.useQuery({ id });
  const update = trpcRouter.update.useMutation();

  const handleSubmit = async (formData: any) => {
    await update.mutateAsync({ id, ...formData });
    router.push(`/admin/${modelKey}`);
  };

  if (isLoading || !data) return <div className="p-6">در حال بارگذاری...</div>;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">ویرایش {meta.name}</h1>
      <AdminForm model={meta} initialData={data} onSubmit={handleSubmit} />
    </div>
  );
}
