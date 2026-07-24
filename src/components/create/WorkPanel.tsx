"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  MoreVertical,
  GripVertical,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateStore, type ChapterItem, type NovelItem } from "@/stores/useCreateStore";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function formatWordCount(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万字`;
  return `${count}字`;
}

const COVER_COLORS = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-cyan-500",
];

function getCoverColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COVER_COLORS[Math.abs(hash) % COVER_COLORS.length];
}

/* ------------------------------------------------------------------ */
/*  Mock / Seed Data                                                  */
/* ------------------------------------------------------------------ */

const MOCK_NOVELS: NovelItem[] = [
  {
    id: "mock-1",
    title: "灌篮之王",
    summary: "一个普通少年通过篮球找到人生方向的热血故事",
    status: "PUBLISHED",
    categoryName: "竞技",
    wordCount: 125000,
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-03-20T10:30:00Z",
    chapters: [
      { id: "ch-1-1", title: "第一章 篮球少年", content: "", order: 1, status: "published", wordCount: 4200, createdAt: "2024-01-15T08:00:00Z", updatedAt: "2024-01-15T10:00:00Z" },
      { id: "ch-1-2", title: "第二章 初次比赛", content: "", order: 2, status: "published", wordCount: 3800, createdAt: "2024-01-16T08:00:00Z", updatedAt: "2024-01-16T10:00:00Z" },
      { id: "ch-1-3", title: "第三章 意外受伤", content: "", order: 3, status: "published", wordCount: 4100, createdAt: "2024-01-17T08:00:00Z", updatedAt: "2024-01-17T10:00:00Z" },
      { id: "ch-1-4", title: "第四章 重新站起", content: "", order: 4, status: "draft", wordCount: 3500, createdAt: "2024-01-18T08:00:00Z", updatedAt: "2024-01-18T10:00:00Z" },
      { id: "ch-1-5", title: "第五章 决战前夜", content: "", order: 5, status: "draft", wordCount: 2900, createdAt: "2024-01-19T08:00:00Z", updatedAt: "2024-01-19T10:00:00Z" },
    ],
  },
  {
    id: "mock-2",
    title: "都市异能者",
    summary: "繁华都市中隐藏着拥有异能的人们",
    status: "PUBLISHED",
    categoryName: "都市",
    wordCount: 82000,
    createdAt: "2024-02-01T08:00:00Z",
    updatedAt: "2024-03-18T14:00:00Z",
    chapters: [
      { id: "ch-2-1", title: "第一章 觉醒", content: "", order: 1, status: "published", wordCount: 5000, createdAt: "2024-02-01T08:00:00Z", updatedAt: "2024-02-01T10:00:00Z" },
      { id: "ch-2-2", title: "第二章 异能世界", content: "", order: 2, status: "published", wordCount: 4500, createdAt: "2024-02-02T08:00:00Z", updatedAt: "2024-02-02T10:00:00Z" },
      { id: "ch-2-3", title: "第三章 神秘组织", content: "", order: 3, status: "published", wordCount: 4800, createdAt: "2024-02-03T08:00:00Z", updatedAt: "2024-02-03T10:00:00Z" },
      { id: "ch-2-4", title: "第四章 暗中较量", content: "", order: 4, status: "draft", wordCount: 3200, createdAt: "2024-02-04T08:00:00Z", updatedAt: "2024-02-04T10:00:00Z" },
    ],
  },
  {
    id: "mock-3",
    title: "问道长生",
    summary: "修仙之路，漫漫长途",
    status: "DRAFT",
    categoryName: "仙侠",
    wordCount: 23000,
    createdAt: "2024-03-01T08:00:00Z",
    updatedAt: "2024-03-15T09:00:00Z",
    chapters: [
      { id: "ch-3-1", title: "序章 仙途", content: "", order: 1, status: "published", wordCount: 3000, createdAt: "2024-03-01T08:00:00Z", updatedAt: "2024-03-01T10:00:00Z" },
      { id: "ch-3-2", title: "第一章 入门", content: "", order: 2, status: "draft", wordCount: 2500, createdAt: "2024-03-02T08:00:00Z", updatedAt: "2024-03-02T10:00:00Z" },
      { id: "ch-3-3", title: "第二章 修炼", content: "", order: 3, status: "draft", wordCount: 2800, createdAt: "2024-03-03T08:00:00Z", updatedAt: "2024-03-03T10:00:00Z" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Sortable Chapter Item                                             */
/* ------------------------------------------------------------------ */

function SortableChapterItem({
  chapter,
  isSelected,
  isEditing,
  editTitle,
  onSelect,
  onDelete,
  onRenameStart,
  onEditTitleChange,
  onRenameSave,
}: {
  chapter: ChapterItem;
  isSelected: boolean;
  isEditing: boolean;
  editTitle: string;
  onSelect: () => void;
  onDelete: () => void;
  onRenameStart: () => void;
  onEditTitleChange: (v: string) => void;
  onRenameSave: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-1 rounded-md px-2 py-1.5 cursor-pointer ${
        isDragging ? "opacity-40" : ""
      } ${
        isSelected
          ? "bg-primary/10 text-primary"
          : "hover:bg-muted/60"
      }`}
      onClick={onSelect}
      onDoubleClick={onRenameStart}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="cursor-grab text-muted-foreground/50 hover:text-muted-foreground shrink-0 active:cursor-grabbing"
        onPointerDown={(e) => {
          e.stopPropagation();
          listeners?.onPointerDown?.(e);
        }}
        onClick={(e) => e.stopPropagation()}
        {...listeners}
        {...attributes}
      >
        <GripVertical className="size-3.5" />
      </button>

      {/* Chapter icon + title */}
      <FileText className="size-3.5 shrink-0 text-muted-foreground" />

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editTitle}
          onChange={(e) => onEditTitleChange(e.target.value)}
          onBlur={onRenameSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") onRenameSave();
            if (e.key === "Escape") onRenameSave();
          }}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 min-w-0 rounded border border-input bg-background px-1.5 py-0 text-xs outline-none focus:border-ring"
        />
      ) : (
        <span className="flex-1 min-w-0 truncate text-xs">
          {chapter.title}
        </span>
      )}

      {/* Word count */}
      <span className="text-[10px] text-muted-foreground shrink-0">
        {formatWordCount(chapter.wordCount)}
      </span>

      {/* Status badge */}
      {chapter.status === "published" && (
        <Badge className="h-4 bg-emerald-500/10 text-emerald-600 border-0 text-[10px] px-1 shrink-0">
          已发布
        </Badge>
      )}
      {(chapter.status === "draft" || chapter.status === "editing") && (
        <Badge className="h-4 bg-muted text-muted-foreground border-0 text-[10px] px-1 shrink-0">
          草稿
        </Badge>
      )}

      {/* Hover action menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground rounded p-0.5"
              onClick={(e) => e.stopPropagation()}
            />
          }
        >
          <MoreHorizontal className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right" sideOffset={4}>
          <DropdownMenuItem onSelect={onRenameStart}>
            <Pencil className="size-3.5" />
            重命名
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault();
              onDelete();
            }}
          >
            <Trash2 className="size-3.5" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Work Panel                                                        */
/* ------------------------------------------------------------------ */

export function WorkPanel() {
  const t = useTranslations("create");

  /* ---- Store ---- */
  const novels = useCreateStore((s) => s.novels);
  const setNovels = useCreateStore((s) => s.setNovels);
  const currentNovelId = useCreateStore((s) => s.currentNovelId);
  const currentChapterId = useCreateStore((s) => s.currentChapterId);
  const setCurrentNovel = useCreateStore((s) => s.setCurrentNovel);
  const setCurrentChapter = useCreateStore((s) => s.setCurrentChapter);
  const setNewNovelDialogOpen = useCreateStore(
    (s) => s.setNewNovelDialogOpen
  );
  const addChapter = useCreateStore((s) => s.addChapter);
  const updateChapter = useCreateStore((s) => s.updateChapter);
  const deleteChapter = useCreateStore((s) => s.deleteChapter);
  const reorderChapters = useCreateStore((s) => s.reorderChapters);

  /* ---- Init mock data ---- */
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && novels.length === 0) {
      setNovels(MOCK_NOVELS);
      initialized.current = true;
    }
  }, [novels.length, setNovels]);

  /* ---- Local state ---- */
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  /* ---- DnD sensors ---- */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  /* ---- Derived ---- */
  const currentNovel = novels.find((n) => n.id === currentNovelId) ?? null;
  const chapters = currentNovel?.chapters ?? [];

  /* ---- Handlers ---- */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !currentNovelId) return;

      const currentNovelForDnd = novels.find(
        (n) => n.id === currentNovelId
      );
      if (!currentNovelForDnd) return;

      const oldIndex = currentNovelForDnd.chapters.findIndex(
        (c) => c.id === active.id
      );
      const newIndex = currentNovelForDnd.chapters.findIndex(
        (c) => c.id === over.id
      );
      if (oldIndex === -1 || newIndex === -1) return;

      const newChapters = arrayMove(
        currentNovelForDnd.chapters,
        oldIndex,
        newIndex
      ).map((c, i) => ({ ...c, order: i + 1 }));

      reorderChapters(newChapters);
    },
    [currentNovelId, novels, reorderChapters]
  );

  const handleNewChapter = useCallback(() => {
    if (!currentNovelId) return;
    const now = new Date().toISOString();
    const newCh: ChapterItem = {
      id: `ch-${Date.now()}`,
      title: `${t("newChapter")}`,
      content: "",
      order: chapters.length + 1,
      status: "draft",
      wordCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    addChapter(newCh);
    setCurrentChapter(newCh.id);
  }, [currentNovelId, chapters.length, addChapter, setCurrentChapter, t]);

  const handleDeleteChapter = useCallback(
    (chapterId: string) => {
      deleteChapter(chapterId);
    },
    [deleteChapter]
  );

  const handleStartRename = useCallback(
    (chapter: ChapterItem) => {
      setEditingChapterId(chapter.id);
      setEditTitle(chapter.title);
    },
    []
  );

  const handleSaveRename = useCallback(() => {
    if (editingChapterId && editTitle.trim()) {
      updateChapter(editingChapterId, { title: editTitle.trim() });
    }
    setEditingChapterId(null);
    setEditTitle("");
  }, [editingChapterId, editTitle, updateChapter]);

  /* ---- Render ---- */
  return (
    <div className="flex flex-col h-full">
      {/* 新建作品按钮 */}
      <div className="p-3 pb-2">
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => setNewNovelDialogOpen(true)}
        >
          <Plus className="size-4" />
          新建作品
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 pb-3">
          {/* 我的作品标题 */}
          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("myWorks")} ({novels.length})
            </span>
            <DropdownMenu open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-xs" />
                }
              >
                <MoreVertical className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>排序方式</DropdownMenuItem>
                <DropdownMenuItem>全部展开</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 作品列表 */}
          <div className="flex flex-col gap-0.5">
            {novels.map((novel) => (
              <div key={novel.id}>
                {/* Novel item */}
                <div
                  role="button"
                  tabIndex={0}
                  className={`w-full flex items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors cursor-pointer ${
                    currentNovelId === novel.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/60"
                  }`}
                  onClick={() => setCurrentNovel(novel.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setCurrentNovel(novel.id) }}
                >
                  {/* Cover placeholder */}
                  <div
                    className={`w-8 h-8 rounded-md shrink-0 ${getCoverColor(novel.id)}`}
                  />
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium truncate">
                        {novel.title}
                      </span>
                      {novel.status === "PUBLISHED" && (
                        <Badge className="h-4 bg-emerald-500/10 text-emerald-600 border-0 text-[10px] px-1 shrink-0">
                          {t("serializing")}
                        </Badge>
                      )}
                      {novel.status === "DRAFT" && (
                        <Badge className="h-4 bg-muted text-muted-foreground border-0 text-[10px] px-1 shrink-0">
                          {t("draft")}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground">
                        {formatWordCount(novel.wordCount)}
                      </span>
                      {novel.categoryName && (
                        <Badge
                          variant="outline"
                          className="h-4 text-[10px] px-1 border-muted-foreground/20 text-muted-foreground shrink-0"
                        >
                          {novel.categoryName}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chapter list for selected novel */}
                {currentNovelId === novel.id && (
                  <div className="mt-1 ml-2">
                    {/* Chapter header */}
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {t("chapterList")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={handleNewChapter}
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>

                    {/* Sortable chapter list */}
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={chapters.map((c) => c.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="flex flex-col gap-px">
                          {chapters.map((chapter) => (
                            <SortableChapterItem
                              key={chapter.id}
                              chapter={chapter}
                              isSelected={
                                currentChapterId === chapter.id
                              }
                              isEditing={
                                editingChapterId === chapter.id
                              }
                              editTitle={editTitle}
                              onSelect={() =>
                                setCurrentChapter(chapter.id)
                              }
                              onDelete={() =>
                                handleDeleteChapter(chapter.id)
                              }
                              onRenameStart={() =>
                                handleStartRename(chapter)
                              }
                              onEditTitleChange={setEditTitle}
                              onRenameSave={handleSaveRename}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
