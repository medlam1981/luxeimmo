'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading2, Heading3 } from 'lucide-react';
import { useEffect } from 'react';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800'}`}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800'}`}
      >
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 my-auto mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800'}`}
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800'}`}
      >
        <Heading3 className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 my-auto mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800'}`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800'}`}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
    </div>
  );
};

export function RichTextEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none focus:ring-0',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-950 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
