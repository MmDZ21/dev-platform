"use client";
import { AdminForm } from "@/components/admin/shared/AdminForm";
import { postMeta } from "@/modules/blog/postMeta";
import { trpc } from "@/lib/trpc/client";
import { useParams, useRouter } from "next/navigation";

export default function EditPostPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data, isLoading } = trpc.post.getById.useQuery({ id });
  const update = trpc.post.update.useMutation();

  const handleSubmit = async (formData: any) => {
    await update.mutateAsync({ id, ...formData });
    router.push("/admin/post");
  };

  if (isLoading || !data) return <div className="p-6">در حال بارگذاری...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ویرایش پست</h1>
      <AdminForm
        model={postMeta}
        initialData={data}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
