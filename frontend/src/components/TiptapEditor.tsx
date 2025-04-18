"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

export default function TiptapEditor({
  content,
  onChange,
}: {
  content?: string;
  onChange?: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  return (
    <div className="border p-4 rounded-md min-h-[200px]">
      <EditorContent editor={editor} />
    </div>
  );
}
