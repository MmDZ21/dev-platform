'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Heading from '@tiptap/extension-heading';
import History from '@tiptap/extension-history';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

import { useEffect } from 'react';
import { RichTextToolbar } from './RichTextToolbar';

type Props = {
  value?: string;
  onChange: (content: string) => void;
  label?: string;
  required?: boolean;
};

export function RichTextField({ value, onChange, label, required }: Props) {
  const editor = useEditor({
  extensions: [
    StarterKit.configure({ history: false }),
    History,
    Underline,
    Heading.configure({ levels: [1, 2] }),
    Placeholder.configure({ placeholder: 'Start typing...' }),
    Link.configure({ openOnClick: false }),
    Image, // ✅ THIS LINE IS REQUIRED
  ],
  immediatelyRender:false,
    content: value ?? '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

useEffect(() => {
  if (editor && value) {
    editor.commands.setContent(value);
  }
}, [editor]);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block font-medium">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <RichTextToolbar editor={editor} />
      <div className="min-h-[150px] rounded border p-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
