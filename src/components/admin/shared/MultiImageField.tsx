// src/components/admin/shared/MultiImageField.tsx
'use client';

import { useState } from 'react';
import { useUploader } from '@/lib/hooks/useUploader';

type Props = {
  value: string[];                     // همیشه آرایه
  onChange: (urls: string[]) => void;
  label?: string;
  required?: boolean;                  // معمولاً false
};

export default function MultiImageField({
  value,
  onChange,
  label,
  required,
}: Props) {
  const { uploadFile } = useUploader();
  const [uploading, setUploading] = useState(false);

  /* آپلود چند فایل */
  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const f of files) {
        uploaded.push(await uploadFile(f));
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      alert('❌ Upload failed');
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  /* حذف */
  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block font-medium">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      {/* پیش‌نمایش‌ها */}
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={url} className="relative">
            <img
              src={url}
              alt=""
              className="h-28 w-28 rounded object-cover border"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <input
        multiple
        type="file"
        accept="image/*"
        onChange={handleFiles}
        className="block w-full"
      />

      {uploading && (
        <p className="text-sm text-gray-500">Uploading…</p>
      )}
    </div>
  );
}
