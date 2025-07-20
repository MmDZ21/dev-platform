'use client';
import { trpc } from "@/lib/trpc/client";

type Category = { id: string; name: string };
type SelectFieldProps = {
  value?: string;
  onChange: (val: string) => void;
  label?: string;
  required?: boolean;
};

export function SelectField({ value, onChange, label, required }: SelectFieldProps) {
  const { data = [], isLoading } = trpc.categories.getAll.useQuery<Category[]>();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block font-medium">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <select
        className="w-full border p-2"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        required={required}
        disabled={isLoading}
      >
        <option value="">انتخاب کنید...</option>
        {data.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      {isLoading && <span className="text-xs text-gray-500">در حال بارگذاری...</span>}
    </div>
  );
}
