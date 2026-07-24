"use client"

import { useEffect, useRef, useState } from "react"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import CharacterCount from "@tiptap/extension-character-count"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { FileText } from "lucide-react"
import { useCreateStore } from "@/stores/useCreateStore"
import { RichEditor } from "./RichEditor"
import { EditorToolbar } from "./EditorToolbar"

export function EditorArea() {
  const {
    currentChapter,
    currentChapterId,
    setEditorContent,
    setWordCount,
    setLastSavedAt,
    setIsDirty,
  } = useCreateStore()

  const [isFullscreen, setIsFullscreen] = useState(false)
  const isLoadingRef = useRef(true)
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const chapterIdRef = useRef(currentChapterId)

  // 创建 TipTap 编辑器
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: "开始创作你的故事...",
      }),
      CharacterCount,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    onUpdate({ editor }) {
      if (isLoadingRef.current) {
        isLoadingRef.current = false
        return
      }
      const html = editor.getHTML()
      setEditorContent(html)
      setWordCount(editor.storage.characterCount.characters())
    },
  })

  // 全屏切换
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isFullscreen)
    return () => document.body.classList.remove("overflow-hidden")
  }, [isFullscreen])

  // 切换章节时加载内容
  useEffect(() => {
    if (!editor || !currentChapterId) return
    chapterIdRef.current = currentChapterId
    isLoadingRef.current = true

    const content = currentChapter?.content ?? ""
    if (editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
    setWordCount(editor.storage.characterCount.characters())
    setIsDirty(false)

    // 初始加载后重置标志
    requestAnimationFrame(() => {
      isLoadingRef.current = false
    })
  }, [currentChapterId, editor])

  // 自动保存：每 30 秒保存到 localStorage
  useEffect(() => {
    if (!editor) return

    saveTimerRef.current = setInterval(() => {
      const cid = chapterIdRef.current
      if (cid) {
        localStorage.setItem(
          `create-autosave-${cid}`,
          editor.getHTML()
        )
        setLastSavedAt(new Date().toISOString())
      }
    }, 30000)

    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current)
    }
  }, [editor, setLastSavedAt])

  // 组件卸载时保存
  useEffect(() => {
    return () => {
      if (editor && chapterIdRef.current) {
        localStorage.setItem(
          `create-autosave-${chapterIdRef.current}`,
          editor.getHTML()
        )
      }
    }
  }, [editor])

  if (!currentChapter) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
        <FileText className="size-12 opacity-30" />
        <p className="text-sm">请选择一个章节开始创作</p>
      </div>
    )
  }

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-40 flex flex-col bg-background"
          : "flex h-full flex-col"
      }
    >
      <EditorToolbar
        editor={editor}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
      />
      <RichEditor editor={editor} />
    </div>
  )
}
