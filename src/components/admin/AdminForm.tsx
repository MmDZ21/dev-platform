"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AdminModel, FieldSchema } from "@/lib/admin/meta";
import { trpc } from "@/lib/trpc/client";
import { useUploader } from "@/lib/hooks/useUploader";
import { adminModelRouterMap } from "@/modules/adminRouterMap.client";

type AdminFormProps = {
  meta: AdminModel;
  modelKey: keyof typeof adminModelRouterMap;
  initial?: Record<string, any> | null;
  onSubmit: (values: Record<string, any>) => Promise<void> | void;
  saving?: boolean;
};

function FieldInput({ name, schema, value, onChange }: { name: string; schema: FieldSchema; value: any; onChange: (v: any) => void }) {
  const common = "block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200";
  const { uploadFile } = useUploader();

  switch (schema.type) {
    case "text":
      return <input className={common} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "number":
      return <input type="number" className={common} value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />;
    case "boolean":
      return (
        <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" className="size-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <span>بله</span>
        </label>
      );
    case "richText":
      return <textarea className={`${common} h-40`} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "image":
    case "file":
      return (
        <div className="flex items-center gap-2">
          <input type="text" placeholder="URL" className={common + " flex-1"} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
          <label className="cursor-pointer rounded-md border border-gray-200 px-2 py-1 text-xs dark:border-gray-800">
            آپلود
            <input
              type="file"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = await uploadFile(f);
                onChange(url);
              }}
            />
          </label>
        </div>
      );
    case "multi-image":
      return (
        <div className="space-y-2">
          <textarea
            className={`${common} h-24`}
            placeholder="هر خط یک URL تصویر"
            value={Array.isArray(value) ? (value as string[]).join("\n") : ""}
            onChange={(e) => onChange(e.target.value.split("\n").filter(Boolean))}
          />
          <input
            type="file"
            multiple
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              if (!files.length) return;
              const urls: string[] = [];
              for (const f of files) {
                const url = await uploadFile(f);
                urls.push(url);
              }
              const prev = Array.isArray(value) ? value : [];
              onChange([...prev, ...urls]);
            }}
          />
        </div>
      );
    case "select":
      // For now, expect parent to pass options via separate endpoints/pages; placeholder basic input
      return <input className={common} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="شناسه گزینه" />;
    case "multi-select":
      return (
        <textarea
          className={`${common} h-24`}
          placeholder="هر خط یک شناسه"
          value={Array.isArray(value) ? (value as string[]).join("\n") : ""}
          onChange={(e) => onChange(e.target.value.split("\n").filter(Boolean))}
        />
      );
    default:
      return <input className={common} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
}

export default function AdminForm({ meta, modelKey, initial, onSubmit, saving }: AdminFormProps) {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const v: Record<string, any> = {};
    for (const [key, field] of Object.entries(meta.fields)) {
      if (initial && key in initial) v[key] = (initial as any)[key];
      else if (field.type === "number") v[key] = 0;
      else if (field.type === "boolean") v[key] = false;
      else if (field.type === "multi-image" || field.type === "multi-select") v[key] = [];
      else v[key] = "";
    }
    return v;
  });

  useEffect(() => {
    if (initial) setValues((prev) => ({ ...prev, ...initial }));
  }, [initial]);

  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        try {
          await onSubmit(values);
        } catch (err: any) {
          setError(err?.message ?? "خطا در ثبت فرم");
        }
      }}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Object.entries(meta.fields).map(([name, schema]) => (
          <div key={name} className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {schema.label} {schema.required && <span className="text-red-500">*</span>}
            </label>
            <FieldInput name={name} schema={schema} value={values[name]} onChange={(v) => setValues((prev) => ({ ...prev, [name]: v }))} />
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!!saving}
          className="inline-flex items-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          ذخیره
        </button>
      </div>
    </form>
  );
}


