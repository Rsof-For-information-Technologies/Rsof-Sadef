"use client";

import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./menu-bar";
import TextStyle from "@tiptap/extension-text-style";
import FontSize from "@tiptap/extension-font-size";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";

interface RichTextEditorProps {
  label?: string;
  id?: string;
  placeholder?: string;
  error?: string;
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
  label,
  id,
  placeholder,
  error,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
      Link,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[170px] p-2 border-2 rounded-md bg-white dark:bg-gray-100 dark:text-gray-500",
        placeholder: placeholder ?? "",
      },
    },
  });

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
      {error && <p className="text-sm text-[rgb(238,0,15)]">{error}</p>}
    </div>
  );
}
