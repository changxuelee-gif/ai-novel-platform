"use client"

import { useState, useEffect } from "react"
import type { Editor } from "@tiptap/react"
import {
  Eye,
  Save,
  Send,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Minus,
  Maximize,
  Minimize,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCreateStore } from "@/stores/useCreateStore"
import { trpc } from "@/trpc/client"
import { cn } from "@/lib/utils"

interface EditorToolbarProps {
  editor: Editor | null
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

const headingOptions = [
  { value: "body", label: "正文" },
  { value: "1", label: "H1" },
  { value: "2", label: "H2" },
  { value: "3", label: "H3" },
]

export function EditorToolbar({
  editor,
  isFullscreen,
  onToggleFullscreen,
}: EditorToolbarProps) {
  const {
    currentChapter,
    currentChapterId,
    currentNovelId,
    wordCount,
    lastSavedAt,
    editorContent,
    updateCurrentChapter,
    setLastSavedAt,
    publishDialogOpen,
    setPublishDialogOpen,
  } = useCreateStore()

  // 章节标题编辑
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState("")
  const [currentHeading, setCurrentHeading] = useState("body")

  // 同步标题
  useEffect(() => {
    if (currentChapter) {
      setTitleValue(currentChapter.title)
    }
  }, [currentChapter?.id, currentChapter])

  // 同步当前标题级别
  useEffect(() => {
    if (!editor) return
    const update = () => {
      if (editor.isActive("heading", { level: 1 })) setCurrentHeading("1")
      else if (editor.isActive("heading", { level: 2 })) setCurrentHeading("2")
      else if (editor.isActive("heading", { level: 3 })) setCurrentHeading("3")
      else setCurrentHeading("body")
    }
    update()
    editor.on("selectionUpdate", update)
    return () => {
      editor.off("selectionUpdate", update)
    }
  }, [editor])

  // 保存草稿
  const saveMutation = trpc.chapter.update.useMutation({
    onSuccess: () => {
      const now = new Date().toISOString()
      setLastSavedAt(now)
      updateCurrentChapter({
        content: editorContent,
        wordCount,
        updatedAt: now,
      })
    },
  })

  const handleSave = () => {
    if (!currentChapterId) return
    saveMutation.mutate({
      id: currentChapterId,
      content: editorContent,
    })
  }

  // 保存标题
  const titleMutation = trpc.chapter.update.useMutation()

  const handleSaveTitle = () => {
    if (!currentChapterId || !titleValue.trim()) return
    updateCurrentChapter({ title: titleValue.trim() })
    titleMutation.mutate({
      id: currentChapterId,
      title: titleValue.trim(),
    })
    setIsEditingTitle(false)
  }

  // 计算上次保存时间
  const savedTimeAgo = (() => {
    if (!lastSavedAt) return null
    const diff = Date.now() - new Date(lastSavedAt).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "刚刚"
    if (minutes < 60) return `${minutes}分钟前`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}小时前`
    return `${Math.floor(hours / 24)}天前`
  })()

  // 设置标题级别
  const setHeadingLevel = (value: string) => {
    if (!editor) return
    if (value === "body") {
      editor.chain().focus().setParagraph().run()
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: Number(value) as 1 | 2 | 3 })
        .run()
    }
  }

  return (
    <>
      {/* 顶部栏 */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        {/* 左侧：章节标题 */}
        <div className="min-w-0 flex-1">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle()
                if (e.key === "Escape") {
                  setTitleValue(currentChapter?.title ?? "")
                  setIsEditingTitle(false)
                }
              }}
              autoFocus
              className="h-7 w-full max-w-xs rounded border border-input bg-background px-2 text-sm font-medium outline-none focus:border-ring"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="h-7 rounded px-1 text-sm font-medium text-foreground hover:bg-muted"
            >
              {currentChapter?.title ?? "未命名章节"}
            </button>
          )}
        </div>

        {/* 中间：字数 + 保存状态 */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>当前字数: {wordCount.toLocaleString()}</span>
          {savedTimeAgo && <span>上次保存: {savedTimeAgo}</span>}
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" title="预览">
            <Eye className="size-3.5" />
            <span className="ml-1">预览</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={saveMutation.isPending}
            title="保存草稿"
          >
            <Save className="size-3.5" />
            <span className="ml-1">
              {saveMutation.isPending ? "保存中..." : "保存草稿"}
            </span>
          </Button>
          <Button
            size="sm"
            onClick={() => setPublishDialogOpen(true)}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            <Send className="size-3.5" />
            <span className="ml-1">发布章节</span>
          </Button>
        </div>
      </div>

      {/* 格式化工具栏 */}
      <div className="flex items-center gap-0.5 border-b px-4 py-1.5">
        <ToolbarButton
          active={editor?.isActive("bold") ?? false}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          title="加粗"
        >
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor?.isActive("italic") ?? false}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          title="斜体"
        >
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton title="下划线">
          <Underline className="size-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1.5 h-4" />

        <ToolbarButton title="左对齐">
          <AlignLeft className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton title="居中对齐">
          <AlignCenter className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton title="右对齐">
          <AlignRight className="size-3.5" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1.5 h-4" />

        {/* 标题级别下拉 */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs"
              />
            }
          >
            {headingOptions.find((o) => o.value === currentHeading)?.label ??
              "正文"}
            <ChevronDown className="size-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-24">
            {headingOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={currentHeading === option.value}
                onSelect={() => setHeadingLevel(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-1.5 h-4" />

        <ToolbarButton
          active={editor?.isActive("blockquote") ?? false}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          title="引用"
        >
          <Quote className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          title="分割线"
        >
          <Minus className="size-3.5" />
        </ToolbarButton>

        <div className="flex-1" />

        <ToolbarButton
          onClick={onToggleFullscreen}
          title={isFullscreen ? "退出全屏" : "全屏"}
        >
          {isFullscreen ? (
            <Minimize className="size-3.5" />
          ) : (
            <Maximize className="size-3.5" />
          )}
        </ToolbarButton>
      </div>

      {/* 发布对话框 */}
      <PublishDialogSection
        open={publishDialogOpen}
        onOpenChange={setPublishDialogOpen}
        novelId={currentNovelId}
      />
    </>
  )
}

/* ─── 工具栏按钮 ─── */

function ToolbarButton({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        active && "bg-accent text-accent-foreground"
      )}
    >
      {children}
    </button>
  )
}

/* ─── 发布对话框（内联实现，避免额外文件） ─── */

function PublishDialogSection({
  open,
  onOpenChange,
  novelId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  novelId: string | null
}) {
  const [publishType, setPublishType] = useState<
    "public" | "private" | "scheduled"
  >("public")
  const [scheduledTime, setScheduledTime] = useState("")

  const updateNovel = trpc.novel.update.useMutation({
    onSuccess: () => {
      onOpenChange(false)
    },
  })

  const handleConfirm = () => {
    if (!novelId) return
    updateNovel.mutate({
      id: novelId,
      status: "PUBLISHED" as const,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>发布章节</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input
              type="radio"
              name="publishType"
              checked={publishType === "public"}
              onChange={() => setPublishType("public")}
              className="accent-purple-600"
            />
            <div>
              <div className="text-sm font-medium">公开</div>
              <div className="text-xs text-muted-foreground">
                所有读者可见
              </div>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input
              type="radio"
              name="publishType"
              checked={publishType === "private"}
              onChange={() => setPublishType("private")}
              className="accent-purple-600"
            />
            <div>
              <div className="text-sm font-medium">仅自己可见</div>
              <div className="text-xs text-muted-foreground">
                只有作者本人可以查看
              </div>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input
              type="radio"
              name="publishType"
              checked={publishType === "scheduled"}
              onChange={() => setPublishType("scheduled")}
              className="accent-purple-600"
            />
            <div className="flex-1">
              <div className="text-sm font-medium">定时发布</div>
              <div className="text-xs text-muted-foreground">
                设定时间自动发布
              </div>
            </div>
          </label>

          {publishType === "scheduled" && (
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="ml-6 h-8 rounded border border-input bg-background px-2 text-sm outline-none focus:border-ring"
            />
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>取消</DialogClose>
          <Button
            onClick={handleConfirm}
            disabled={updateNovel.isPending}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            {updateNovel.isPending ? "发布中..." : "确认发布"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
