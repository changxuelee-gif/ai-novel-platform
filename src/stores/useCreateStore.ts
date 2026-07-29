import { create } from "zustand";
import { extractChapterSummary, countWords } from "@/lib/ai/chapter-utils";

export interface ChapterItem {
  id: string;
  title: string;
  content: string;
  order: number;
  status: "published" | "draft" | "editing";
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NovelItem {
  id: string;
  title: string;
  summary?: string;
  cover?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId?: string;
  categoryName?: string;
  wordCount: number;
  chapters: ChapterItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  actions?: string[];
}

export interface CreationCharacter {
  name: string;
  gender: string;
  age: number;
  personality: string;
  background: string;
  goal: string;
  appearance: string;
}

export interface CreationOutlineChapter {
  order: number;
  title: string;
  summary: string;
}

export interface CreationGeneratedChapter {
  title: string;
  content: string;
  summary?: string;
  order: number;
  wordCount: number;
}

export interface CreationMetadata {
  title: string;
  category: string;
  tags: string[];
  summary: string;
}

export interface CreationData {
  concept?: string;
  selectedCategory?: string;
  selectedTags?: string[];
  metadata?: CreationMetadata;
  worldview?: string;
  character?: CreationCharacter;
  outline?: CreationOutlineChapter[];
  generatedChapters?: CreationGeneratedChapter[];
  currentGeneratingChapter?: number;
  chapterStreamContent?: string;
}

interface CreateState {
  // 作品与章节
  novels: NovelItem[];
  currentNovelId: string | null;
  currentChapterId: string | null;
  currentChapter: ChapterItem | null;

  // 编辑器
  editorContent: string;
  wordCount: number;
  lastSavedAt: string | null;
  isSaving: boolean;
  isDirty: boolean;

  // AI 助手
  aiMessages: AiMessage[];
  aiActiveTab: "continue" | "inspire" | "polish";
  aiGenerating: boolean;

  // UI 状态
  newNovelDialogOpen: boolean;
  publishDialogOpen: boolean;

  // AI创作流程
  creationMode: "oneclick" | "guided" | null;
  creationStep: number;
  creationData: CreationData;
  creationLoading: boolean;
  creationError: string | null;
  creationModeDialogOpen: boolean;

  // Actions - 作品
  setNovels: (novels: NovelItem[]) => void;
  setCurrentNovel: (novelId: string) => void;
  setCurrentChapter: (chapterId: string | null) => void;
  updateCurrentChapter: (chapter: Partial<ChapterItem>) => void;

  // Actions - 编辑器
  setEditorContent: (content: string) => void;
  setWordCount: (count: number) => void;
  setLastSavedAt: (time: string) => void;
  setIsSaving: (saving: boolean) => void;
  setIsDirty: (dirty: boolean) => void;

  // Actions - AI
  addAiMessage: (message: AiMessage) => void;
  setAiActiveTab: (tab: "continue" | "inspire" | "polish") => void;
  setAiGenerating: (generating: boolean) => void;
  clearAiMessages: () => void;

  // Actions - UI
  setNewNovelDialogOpen: (open: boolean) => void;
  setPublishDialogOpen: (open: boolean) => void;

  // Actions - 章节管理
  addChapter: (chapter: ChapterItem) => void;
  updateChapter: (chapterId: string, updates: Partial<ChapterItem>) => void;
  deleteChapter: (chapterId: string) => void;
  reorderChapters: (chapters: ChapterItem[]) => void;

  // Actions - 作品管理
  addNovel: (novel: NovelItem) => void;
  updateNovel: (novelId: string, updates: Partial<NovelItem>) => void;
  removeNovel: (novelId: string) => void;

  // Actions - AI创作流程
  setCreationMode: (mode: "oneclick" | "guided" | null) => void;
  setCreationStep: (step: number) => void;
  updateCreationData: (data: Partial<CreationData>) => void;
  resetCreationFlow: () => void;
  setCreationLoading: (loading: boolean) => void;
  setCreationError: (error: string | null) => void;
  setCreationModeDialogOpen: (open: boolean) => void;
  appendGeneratedChapterContent: (chunk: string) => void;
  finalizeGeneratedChapter: () => void;
}

export const useCreateStore = create<CreateState>((set) => ({
  // 初始状态
  novels: [],
  currentNovelId: null,
  currentChapterId: null,
  currentChapter: null,
  editorContent: "",
  wordCount: 0,
  lastSavedAt: null,
  isSaving: false,
  isDirty: false,
  aiMessages: [],
  aiActiveTab: "continue",
  aiGenerating: false,
  newNovelDialogOpen: false,
  publishDialogOpen: false,
  creationMode: null,
  creationStep: 0,
  creationData: {},
  creationLoading: false,
  creationError: null,
  creationModeDialogOpen: false,

  // 作品 Actions
  setNovels: (novels) => set({ novels }),
  setCurrentNovel: (novelId) =>
    set((state) => {
      const novel = state.novels.find((n) => n.id === novelId);
      const firstChapter = novel?.chapters[0] ?? null;
      return {
        currentNovelId: novelId,
        currentChapterId: firstChapter?.id ?? null,
        currentChapter: firstChapter,
        editorContent: firstChapter?.content ?? "",
        wordCount: firstChapter?.wordCount ?? 0,
      };
    }),
  setCurrentChapter: (chapterId) =>
    set((state) => {
      const novel = state.novels.find((n) => n.id === state.currentNovelId);
      const chapter = novel?.chapters.find((c) => c.id === chapterId) ?? null;
      return {
        currentChapterId: chapterId,
        currentChapter: chapter,
        editorContent: chapter?.content ?? "",
        wordCount: chapter?.wordCount ?? 0,
      };
    }),
  updateCurrentChapter: (updates) =>
    set((state) => {
      if (!state.currentChapter) return {};
      const updated = { ...state.currentChapter, ...updates };
      return { currentChapter: updated };
    }),

  // 编辑器 Actions
  setEditorContent: (content) =>
    set({ editorContent: content, isDirty: true }),
  setWordCount: (count) => set({ wordCount: count }),
  setLastSavedAt: (time) => set({ lastSavedAt: time, isDirty: false }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setIsDirty: (dirty) => set({ isDirty: dirty }),

  // AI Actions
  addAiMessage: (message) =>
    set((state) => ({ aiMessages: [...state.aiMessages, message] })),
  setAiActiveTab: (tab) => set({ aiActiveTab: tab }),
  setAiGenerating: (generating) => set({ aiGenerating: generating }),
  clearAiMessages: () => set({ aiMessages: [] }),

  // UI Actions
  setNewNovelDialogOpen: (open) => set({ newNovelDialogOpen: open }),
  setPublishDialogOpen: (open) => set({ publishDialogOpen: open }),

  // 章节管理 Actions
  addChapter: (chapter) =>
    set((state) => {
      if (!state.currentNovelId) return {};
      return {
        novels: state.novels.map((n) =>
          n.id === state.currentNovelId
            ? { ...n, chapters: [...n.chapters, chapter] }
            : n
        ),
      };
    }),
  updateChapter: (chapterId, updates) =>
    set((state) => {
      if (!state.currentNovelId) return {};
      return {
        novels: state.novels.map((n) =>
          n.id === state.currentNovelId
            ? {
                ...n,
                chapters: n.chapters.map((c) =>
                  c.id === chapterId ? { ...c, ...updates } : c
                ),
              }
            : n
        ),
        currentChapter:
          state.currentChapter?.id === chapterId
            ? { ...state.currentChapter, ...updates }
            : state.currentChapter,
      };
    }),
  deleteChapter: (chapterId) =>
    set((state) => {
      if (!state.currentNovelId) return {};
      const novel = state.novels.find((n) => n.id === state.currentNovelId);
      const remainingChapters = novel?.chapters.filter(
        (c) => c.id !== chapterId
      ) ?? [];
      const newCurrentChapter =
        state.currentChapterId === chapterId
          ? remainingChapters[0] ?? null
          : state.currentChapter;
      return {
        novels: state.novels.map((n) =>
          n.id === state.currentNovelId
            ? { ...n, chapters: remainingChapters }
            : n
        ),
        currentChapterId: newCurrentChapter?.id ?? null,
        currentChapter: newCurrentChapter,
        editorContent: newCurrentChapter?.content ?? "",
        wordCount: newCurrentChapter?.wordCount ?? 0,
      };
    }),
  reorderChapters: (chapters) =>
    set((state) => {
      if (!state.currentNovelId) return {};
      return {
        novels: state.novels.map((n) =>
          n.id === state.currentNovelId ? { ...n, chapters } : n
        ),
      };
    }),

  // 作品管理 Actions
  addNovel: (novel) =>
    set((state) => ({
      novels: [...state.novels, novel],
      currentNovelId: novel.id,
      currentChapterId: novel.chapters[0]?.id ?? null,
      currentChapter: novel.chapters[0] ?? null,
      editorContent: novel.chapters[0]?.content ?? "",
      wordCount: novel.chapters[0]?.wordCount ?? 0,
    })),
  updateNovel: (novelId, updates) =>
    set((state) => ({
      novels: state.novels.map((n) =>
        n.id === novelId ? { ...n, ...updates } : n
      ),
    })),
  removeNovel: (novelId) =>
    set((state) => {
      const remaining = state.novels.filter((n) => n.id !== novelId);
      if (state.currentNovelId === novelId) {
        const nextNovel = remaining[0];
        return {
          novels: remaining,
          currentNovelId: nextNovel?.id ?? null,
          currentChapterId: nextNovel?.chapters[0]?.id ?? null,
          currentChapter: nextNovel?.chapters[0] ?? null,
          editorContent: nextNovel?.chapters[0]?.content ?? "",
          wordCount: nextNovel?.chapters[0]?.wordCount ?? 0,
        };
      }
      return { novels: remaining };
    }),

  // AI创作流程 Actions
  setCreationMode: (mode) => set({ creationMode: mode }),
  setCreationStep: (step) => set({ creationStep: step }),
  updateCreationData: (data) =>
    set((state) => ({
      creationData: { ...state.creationData, ...data },
    })),
  resetCreationFlow: () =>
    set({
      creationMode: null,
      creationStep: 0,
      creationData: {},
      creationLoading: false,
      creationError: null,
    }),
  setCreationLoading: (loading) => set({ creationLoading: loading }),
  setCreationError: (error) => set({ creationError: error }),
  setCreationModeDialogOpen: (open) => set({ creationModeDialogOpen: open }),
  appendGeneratedChapterContent: (chunk) =>
    set((state) => ({
      creationData: {
        ...state.creationData,
        chapterStreamContent:
          (state.creationData.chapterStreamContent || "") + chunk,
      },
    })),
  finalizeGeneratedChapter: () =>
    set((state) => {
      const {
        chapterStreamContent,
        currentGeneratingChapter,
        outline,
        generatedChapters = [],
      } = state.creationData;

      if (
        !chapterStreamContent ||
        currentGeneratingChapter === undefined ||
        !outline
      ) {
        return {
          creationData: {
            ...state.creationData,
            chapterStreamContent: "",
          },
        };
      }

      const chapterInfo = outline[currentGeneratingChapter];
      if (!chapterInfo) {
        return {
          creationData: {
            ...state.creationData,
            chapterStreamContent: "",
          },
        };
      }

      const wordCount = countWords(chapterStreamContent);
      const contentSummary = extractChapterSummary(chapterStreamContent, 200);
      const newChapter: CreationGeneratedChapter = {
        title: chapterInfo.title,
        content: chapterStreamContent,
        summary: contentSummary || chapterInfo.summary,
        order: chapterInfo.order,
        wordCount,
      };

      const nextChapterIndex = currentGeneratingChapter + 1;
      const hasMoreChapters = nextChapterIndex < outline.length;

      return {
        creationData: {
          ...state.creationData,
          generatedChapters: [...generatedChapters, newChapter],
          currentGeneratingChapter: hasMoreChapters ? nextChapterIndex : undefined,
          chapterStreamContent: "",
        },
      };
    }),
}));
