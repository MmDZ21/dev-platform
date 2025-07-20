'use client';

import { Editor } from '@tiptap/react';
import { Toggle } from '@/components/ui/toggle';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { useUploader } from '@/lib/hooks/useUploader';

type Props = {
  editor: Editor | null;
};

export function RichTextToolbar({ editor }: Props) {
  const { uploadFile } = useUploader();

  if (!editor) return null;

  const handleAddLink = () => {
    const url = prompt('🔗 Enter URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
  };

  const handleAddImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const url = await uploadFile(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        alert('❌ Image upload failed');
        console.error(err);
      }
    };

    input.click();
  };

  return (
    <div className="mb-2 flex flex-wrap gap-1 border rounded p-2 bg-muted">
      <Toggle
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </Toggle>
      <Toggle
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </Toggle>
      <Toggle
        pressed={editor.isActive('underline')}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline size={16} />
      </Toggle>
      <Toggle
        pressed={editor.isActive('heading', { level: 1 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={16} />
      </Toggle>
      <Toggle
        pressed={editor.isActive('heading', { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </Toggle>
      <Toggle pressed={false} onPressedChange={handleAddLink}>
        <LinkIcon size={16} />
      </Toggle>
      <Toggle pressed={false} onPressedChange={handleAddImage}>
        <ImageIcon size={16} />
      </Toggle>
    </div>
  );
}
