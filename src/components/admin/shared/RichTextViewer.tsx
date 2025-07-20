'use client';

import { sanitizeHtml } from '@/lib/sanitize-html';

type Props = {
  html: string;
};

export function RichTextViewer({ html }: Props) {
  return (
    <div
      className="prose max-w-none rtl:prose-rtl dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
