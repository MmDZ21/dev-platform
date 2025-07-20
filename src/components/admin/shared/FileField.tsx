'use client';

import { useState } from 'react';
import { useUploader } from '@/lib/hooks/useUploader';

type Props = {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
};

export function FileField({ value, onChange, label, required }: Props) {
  const { uploadFile } = useUploader();
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (err) {
      alert("Upload failed");
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
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline block"
        >
          {value.split("/").pop()}
        </a>
      )}

      <input type="file" onChange={handleChange} className="block" />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}
