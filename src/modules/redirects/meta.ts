import { defineAdminModel } from '@/lib/admin/meta';

export const redirectMeta = defineAdminModel({
  name: 'ریدایرکت‌ها',
  fields: {
    source: { type: 'text', label: 'مبدأ', required: true },
    destination: { type: 'text', label: 'مقصد', required: true },
    permanent: { type: 'boolean', label: 'دائمی؟' },
    locale: { type: 'text', label: 'locale' },
  },
});


