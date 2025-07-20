'use client';

import { useState } from 'react';
import { useUploader } from '@/lib/hooks/useUploader';

type Props = {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
};

export function ImageField({ value, onChange, label, required }: Props) {
  const { uploadFile } = useUploader();
  const [uploading, setUploading] = useState(false);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (err) {
      alert('❌ Upload failed');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block font-medium">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      {value && (
        <img
          src={value}
          alt="Preview"
          className="max-h-48 rounded border object-contain"
        />
      )}

      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleSelect}
          className="block w-full"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        )}
      </div>

      {uploading && (
        <p className="text-sm text-gray-500">Uploading...</p>
      )}
    </div>
  );
}
