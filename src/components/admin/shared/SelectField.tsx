'use client';
import { useOptionsQuery } from "@/lib/admin/useOptionsQuery";

type SelectFieldProps = {
  value?: string;
  onChange: (val: string) => void;
  label?: string;
  required?: boolean;
  optionsKey: string;
  valueField?: string; // پیشفرض "id"
  labelField?: string; // پیشفرض "name"
};

export function SelectField({
  value,
  onChange,
  label,
  required,
  optionsKey,
  valueField = "id",
  labelField = "name",
}: SelectFieldProps) {
  const { data = [], isLoading } = useOptionsQuery(optionsKey);

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
        {data.map((opt: any) => (
          <option key={opt[valueField]} value={opt[valueField]}>
            {opt[labelField]}
          </option>
        ))}
      </select>
      {isLoading && <span className="text-xs text-gray-500">در حال بارگذاری...</span>}
    </div>
  );
}
