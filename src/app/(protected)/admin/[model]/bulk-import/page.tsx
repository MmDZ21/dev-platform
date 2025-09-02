"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

export default function BulkImportPage() {
  const params = useParams<{ model: string }>();
  const modelKey = params.model;
  const [text, setText] = useState("");
  const bulk = trpc.product.bulkUpsert.useMutation();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">درون‌ریزی گروهی</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-600">هر خط یک JSON از فیلدهای محصول (حداقل sku). نمونه: {`{"sku":"A-1","name":"P1"}`}</p>
        <textarea className="mt-2 h-64 w-full rounded border p-2" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="mt-3 flex items-center gap-2">
          <button
            className="rounded bg-brand-600 px-3 py-2 text-sm text-white disabled:opacity-60"
            disabled={bulk.isPending}
            onClick={async () => {
              try {
                const rows = text.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => JSON.parse(l));
                await bulk.mutateAsync({ rows });
                alert('Done');
              } catch (e:any) {
                alert(e.message || 'خطا');
              }
            }}
          >
            اجرا
          </button>
        </div>
      </div>
    </div>
  );
}


