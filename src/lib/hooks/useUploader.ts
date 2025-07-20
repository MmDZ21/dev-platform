'use client';

import { trpc } from '@/lib/trpc/client';

export function useUploader() {
  const upload = trpc.upload.getUploadUrl.useMutation();

  const uploadFile = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const key = `uploads/${Date.now()}.${ext}`;

    const { url } = await upload.mutateAsync({
      key,
      contentType: file.type,
    });

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!res.ok) throw new Error('Upload failed');

    const publicUrl = `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${key}`;
    return publicUrl;
  };

  return { uploadFile };
}
