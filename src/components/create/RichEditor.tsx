"use client"

import { EditorContent, type Editor } from "@tiptap/react"

interface RichEditorProps {
  editor: Editor | null
}

export function RichEditor({ editor }: RichEditorProps) {
  if (!editor) return null

  return (
    <div className="flex-1 overflow-y-auto">
      <EditorContent
        editor={editor}
        className="rich-editor h-full min-h-full px-12 py-8"
      />
    </div>
  )
}
