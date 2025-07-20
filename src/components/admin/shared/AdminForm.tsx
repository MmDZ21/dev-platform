"use client";

import React, { useEffect, useState } from "react";
import type { AdminModel, InferFieldValues } from "@/lib/admin/meta";
import { ImageField } from "./ImageField";
import { FileField } from "./FileField";
import { RichTextField } from "./RichTextField";
import { slugify } from "@/lib/slugify";
import { SelectField } from "./SelectField";
import { MultiSelectField } from "./MultiSelectField";

type AdminFormProps<T extends AdminModel> = {
  model: T;
  initialData?: Partial<InferFieldValues<T>> & { id?: string };
  onSubmit: (data: InferFieldValues<T>) => Promise<void>;
};

// Helper: default value for each field type
function getDefaultValue(type: string) {
  switch (type) {
    case "number":
      return 0;
    case "boolean":
      return false;
    case "multi-select":
      return [];
    default:
      return "";
  }
}

function _AdminForm<T extends AdminModel>({
  model,
  initialData,
  onSubmit,
}: AdminFormProps<T>) {
  const [values, setValues] = useState<InferFieldValues<T>>(() => {
    const defaults = Object.entries(model.fields).reduce(
      (acc, [key, field]) => {
        acc[key as keyof InferFieldValues<T>] = getDefaultValue(field.type) as any;
        return acc;
      },
      {} as InferFieldValues<T>,
    );
    return defaults;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setValues((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Slug auto-generation logic
  const handleChange = (key: string, value: any) => {
    setValues((prev) => {
      const updated = { ...prev, [key]: value };
      if (
        key === "title" &&
        "slug" in prev &&
        ((prev as any).slug === undefined ||
          (prev as any).slug === "" ||
          (prev as any).slug === slugify(String((prev as any).title ?? "")))
      ) {
        (updated as any).slug = slugify(String(value));
      }
      return updated;
    });
  };

  // Simple required fields validation
  function validate() {
    for (const [key, field] of Object.entries(model.fields)) {
      const value = values[key as keyof InferFieldValues<T>];
      if (field.required) {
        if (field.type === "multi-select" && Array.isArray(value) && value.length === 0) {
          setError(`${field.label} is required.`);
          return false;
        }
        if (
          (field.type !== "multi-select" && value === "") ||
          value === undefined ||
          value === null
        ) {
          setError(`${field.label} is required.`);
          return false;
        }
      }
    }
    setError(null);
    return true;
  }

  // Submit handler with error handling and form reset
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSuccess(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(values);
      setSuccess("✅ Saved successfully.");
      // Reset form for new entry (not editing)
      if (!initialData?.id) {
        const reset: any = {};
        Object.entries(model.fields).forEach(([key, field]) => {
          reset[key] = getDefaultValue(field.type);
        });
        setValues(reset as InferFieldValues<T>);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold">
        {initialData?.id ? "✏️ ویرایش" : "➕ ایجاد"} {model.name}
      </h2>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {Object.entries(model.fields).map(([key, field]) => {
          const value = values[key as keyof InferFieldValues<T>];
          const isFirstSEOField = key === "metaTitle";
          return (
            <React.Fragment key={key}>
              {isFirstSEOField && (
                <div className="col-span-full mt-6 mb-2 border-t pt-3">
                  <span className="text-base font-semibold">SEO Metadata</span>
                </div>
              )}
              <div>
                <label className="mb-1 block font-medium">{field.label}</label>
                {field.type === "text" && (
                  <>
                    <input
                      type="text"
                      className="w-full border p-2"
                      value={typeof value === "string" ? value : ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      disabled={loading}
                    />
                    {key === "slug" && value && (
                      <span className="text-xs text-gray-500">
                        URL: /posts/{value}
                      </span>
                    )}
                  </>
                )}
                {field.type === "number" && (
                  <input
                    type="number"
                    className="w-full border p-2"
                    value={typeof value === "number" ? value : 0}
                    onChange={(e) =>
                      handleChange(key, parseFloat(e.target.value))
                    }
                    disabled={loading}
                  />
                )}
                {field.type === "boolean" && (
                  <input
                    type="checkbox"
                    className="me-2"
                    checked={!!value}
                    onChange={(e) => handleChange(key, e.target.checked)}
                    disabled={loading}
                  />
                )}
                {field.type === "image" && (
                  <ImageField
                    value={typeof value === "string" ? value : ""}
                    onChange={(url) => handleChange(key, url)}
                    label={field.label}
                    required={!!field.required}
                  />
                )}
                {field.type === "file" && (
                  <FileField
                    value={typeof value === "string" ? value : ""}
                    onChange={(val) => handleChange(key, val)}
                    label={field.label}
                    required={!!field.required}
                  />
                )}
                {field.type === "richText" && (
                  <RichTextField
                    value={typeof value === "string" ? value : ""}
                    onChange={(val) => handleChange(key, val)}
                    label={field.label}
                    required={!!field.required}
                  />
                )}
                {field.type === "select" && (
                  <SelectField
                    value={typeof value === "string" ? value : ""}
                    onChange={(val) => handleChange(key, val)}
                    label={field.label}
                    required={!!field.required}
                  />
                )}
                {field.type === "multi-select" && (
                  <MultiSelectField
                    value={Array.isArray(value) ? value : []}
                    onChange={(val) => handleChange(key, val)}
                    label={field.label}
                    required={!!field.required}
                  />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white"
        disabled={loading}
      >
        {loading
          ? "ذخیره‌سازی..."
          : initialData?.id
          ? "به‌روزرسانی"
          : "ایجاد"}
      </button>
    </form>
  );
}

// ✅ This makes generics work in JSX
export const AdminForm = <T extends AdminModel>(props: AdminFormProps<T>) => {
  return <_AdminForm {...props} />;
};
