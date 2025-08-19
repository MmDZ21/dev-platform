'use client';
import { trpc } from "@/lib/trpc/client";
import { useEffect } from "react";

type Option = { value: string; label: string };

type MultiSelectFieldProps = {
  value?: string[];
  onChange: (val: string[]) => void;
  label?: string;
  required?: boolean;
};

export function MultiSelectField({ value = [], onChange, label, required }: MultiSelectFieldProps) {
  const { data: options = [], isLoading } = trpc.tags.getAll.useQuery();

  function handleToggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  }

  return (
    <div className="space-y-1">
      {label && (
        <label className="block font-medium">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        {options.map((opt: Option, i: number) => (
          <label key={i} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={value.includes(opt.value)}
              onChange={() => handleToggle(opt.value)}
              disabled={isLoading}
            />
            {opt.label}
          </label>
        ))}
      </div>
      {isLoading && <span className="text-xs text-gray-500">در حال بارگذاری...</span>}
    </div>
  );
}
