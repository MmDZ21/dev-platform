// components/admin/fields/SEOFields.tsx
'use client';

import { ImageField } from './ImageField';

type Props = {
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
};

export function SEOFields({ values, onChange }: Props) {
  return (
    <fieldset className="space-y-2 border-t pt-4 mt-4">
      <legend className="text-base font-semibold">SEO Meta</legend>

      <div>
        <label className="block font-medium">Meta Title</label>
        <input
          type="text"
          className="w-full border p-2"
          value={values.metaTitle || ''}
          onChange={e => onChange('metaTitle', e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Meta Description</label>
        <input
          type="text"
          className="w-full border p-2"
          value={values.metaDescription || ''}
          onChange={e => onChange('metaDescription', e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Canonical URL</label>
        <input
          type="text"
          className="w-full border p-2"
          value={values.canonicalUrl || ''}
          onChange={e => onChange('canonicalUrl', e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">OpenGraph Image</label>
        <ImageField
          value={values.ogImage || ''}
          onChange={url => onChange('ogImage', url)}
        />
      </div>
    </fieldset>
  );
}
