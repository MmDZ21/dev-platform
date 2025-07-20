"use client";
import { AdminForm } from "@/components/admin/shared/AdminForm";
import { postMeta } from "@/modules/blog/postMeta";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const create = trpc.post.create.useMutation();

  const handleSubmit = async (data: any) => {
    await create.mutateAsync(data);
    router.push("/admin/post");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">افزودن پست جدید</h1>
      <AdminForm
        model={postMeta}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
