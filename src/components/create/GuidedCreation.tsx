"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Lightbulb,
  BookOpen,
  User,
  Globe,
  ListOrdered,
  ArrowUp,
  ArrowDown,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { buildPreviousSummary, generateChapterId } from "@/lib/ai/chapter-utils";
import { useCreateStore, type CreationCharacter, type CreationOutlineChapter } from "@/stores/useCreateStore";
import { useChapterStream } from "@/hooks/useCreation";
import { AICover } from "./AICover";
import { trpc } from "@/trpc/client";
import { Link } from "@/i18n/navigation";

const isUnauthorizedError = (message: string | null | undefined) => {
  if (!message) return false;
  return message.includes("UNAUTHORIZED") || message.includes("未登录") || message.includes("401");
};

const getErrorMessage = (message: string | null | undefined, generationFailed: string, loginRequired: string) => {
  if (!message) return generationFailed;
  if (isUnauthorizedError(message)) {
    return loginRequired;
  }
  return message;
};

const CATEGORIES = [
  { name: "玄幻", i18nKey: "fantasy", emoji: "⚔️", tags: ["重生", "系统", "穿越", "升级流", "热血"] },
  { name: "都市", i18nKey: "urban", emoji: "🏙️", tags: ["赘婿", "神医", "总裁", "职场", "逆袭"] },
  { name: "仙侠", i18nKey: "xianxia", emoji: "🏔️", tags: ["修仙", "宗门", "渡劫", "长生", "问道"] },
  { name: "科幻", i18nKey: "scifi", emoji: "🚀", tags: ["末世", "星际", "AI", "赛博朋克", "时空"] },
  { name: "竞技", i18nKey: "sports", emoji: "🏆", tags: ["篮球", "足球", "电竞", "赛车", "奥运"] },
  { name: "历史", i18nKey: "history", emoji: "📜", tags: ["穿越", "三国", "唐朝", "明朝", "战争"] },
  { name: "悬疑", i18nKey: "mystery", emoji: "🔍", tags: ["推理", "破案", "惊悚", "心理", "密室"] },
  { name: "言情", i18nKey: "romance", emoji: "💕", tags: ["甜宠", "虐恋", "穿越", "霸总", "校园"] },
];

const CONCEPT_IDEAS = [
  "一个现代程序员意外穿越到修仙世界，发现代码逻辑竟然可以用来推演功法",
  "落魄青年获得神秘古玉，里面封印着上古大能的残魂，从此开启逆袭人生",
  "星际时代，退役机甲战士被迫重返战场，在宇宙边缘揭开一个惊天秘密",
];

const STEPS = [
  { key: 1, labelKey: "steps.selectCategory", icon: "📚" },
  { key: 2, labelKey: "steps.concept", icon: "💡" },
  { key: 3, labelKey: "steps.worldview", icon: <Globe className="w-4 h-4" /> },
  { key: 4, labelKey: "steps.character", icon: <User className="w-4 h-4" /> },
  { key: 5, labelKey: "steps.outline", icon: <ListOrdered className="w-4 h-4" /> },
  { key: 6, labelKey: "steps.confirm", icon: "✨" },
];

interface GuidedCreationProps {
  onClose?: () => void;
}

export function GuidedCreation({ onClose }: GuidedCreationProps) {
  const t = useTranslations("create");
  const locale = useLocale();
  const {
    creationStep,
    creationData,
    setCreationStep,
    updateCreationData,
    resetCreationFlow,
    appendGeneratedChapterContent,
    finalizeGeneratedChapter,
    addNovel,
    setCurrentChapter,
    setEditorContent,
    setCreationMode,
  } = useCreateStore();

  const [concept, setConcept] = useState(creationData.concept || "");
  const [selectedCategory, setSelectedCategory] = useState(
    creationData.selectedCategory || ""
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    creationData.selectedTags || []
  );
  const [worldview, setWorldview] = useState(creationData.worldview || "");
  const [character, setCharacter] = useState<CreationCharacter>(
    creationData.character || {
      name: "",
      gender: "男",
      age: 18,
      personality: "",
      background: "",
      goal: "",
      appearance: "",
    }
  );
  const [outline, setOutline] = useState<CreationOutlineChapter[]>(
    creationData.outline || []
  );
  const [error, setError] = useState<string | null>(null);
  const [isCreatingNovel, setIsCreatingNovel] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["worldview", "character", "outline"])
  );

  const chapterStream = useChapterStream();
  const generateMetadataMutation = trpc.creation.generateMetadata.useMutation();
  const generateWorldviewMutation = trpc.creation.generateWorldview.useMutation();
  const generateCharacterMutation = trpc.creation.generateCharacter.useMutation();
  const generateOutlineMutation = trpc.creation.generateOutline.useMutation();
  const createNovelMutation = trpc.creation.createNovelWithAI.useMutation();
  const generateCoverMutation = trpc.creation.generateCover.useMutation();

  // Trigger cover generation when entering the completion page (step 8)
  useEffect(() => {
    if (creationStep === 8 && creationData.metadata && !creationData.coverUrl && !coverLoading && !coverError) {
      setCoverLoading(true);
      generateCoverMutation.mutate(
        {
          title: creationData.metadata.title,
          summary: creationData.metadata.summary,
          category: creationData.metadata.category,
          tags: creationData.metadata.tags,
        },
        {
          onSuccess: (result) => {
            updateCreationData({ coverUrl: result.coverUrl });
            setCoverLoading(false);
          },
          onError: (error) => {
            console.error("Cover generation failed:", error);
            setCoverLoading(false);
            setCoverError(true);
            toast.error(t("guided.coverFailed"));
          },
        }
      );
    }
  }, [creationStep]);

  useEffect(() => {
    if (chapterStream.content) {
      appendGeneratedChapterContent(chapterStream.content);
    }
  }, [chapterStream.content, appendGeneratedChapterContent]);

  useEffect(() => {
    if (chapterStream.completed && creationData.outline) {
      const currentIdx = creationData.currentGeneratingChapter ?? 0;
      const currentContent = creationData.chapterStreamContent || "";
      const existingChapters = creationData.generatedChapters || [];

      const chaptersForSummary = [
        ...existingChapters,
        { content: currentContent, summary: undefined },
      ];

      finalizeGeneratedChapter();

      const nextIdx = currentIdx + 1;
      if (
        nextIdx < outline.length &&
        creationData.metadata
      ) {
        setTimeout(() => {
          const previousSummary = buildPreviousSummary(chaptersForSummary);

          updateCreationData({
            currentGeneratingChapter: nextIdx,
            chapterStreamContent: "",
          });
          chapterStream.startGenerating({
            mode: "full",
            concept,
            metadata: creationData.metadata!,
            worldview: creationData.worldview,
            character: creationData.character,
            chapters: outline.map((ch) => ({
              title: ch.title,
              summary: ch.summary,
            })),
            chapterIndex: nextIdx,
            previousSummary,
            locale,
          });
        }, 100);
      } else {
        setCreationStep(8);
      }
    }
  }, [chapterStream.completed]);

  const currentCategory = CATEGORIES.find((c) => c.name === selectedCategory);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const validateStep = (step: number): boolean => {
    setError(null);
    switch (step) {
      case 1:
        if (!selectedCategory) {
          setError(t("guided.validation.selectCategory"));
          return false;
        }
        return true;
      case 2:
        if (concept.length < 10 || concept.length > 500) {
          setError(t("guided.validation.conceptLength"));
          return false;
        }
        return true;
      case 3:
        if (!worldview || worldview.length < 50) {
          setError(t("guided.validation.worldviewLength"));
          return false;
        }
        return true;
      case 4:
        if (
          !character.name ||
          !character.personality ||
          !character.background ||
          !character.goal ||
          !character.appearance
        ) {
          setError(t("guided.validation.characterInfo"));
          return false;
        }
        return true;
      case 5:
        if (outline.length === 0) {
          setError(t("guided.validation.addOutline"));
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (!validateStep(creationStep)) return;

    if (creationStep === 1) {
      updateCreationData({ selectedCategory, selectedTags });
      setCreationStep(2);
    } else if (creationStep === 2) {
      updateCreationData({ concept });
      setCreationStep(3);
      if (!creationData.metadata) {
        await generateMetadata();
      }
    } else if (creationStep === 3) {
      updateCreationData({ worldview });
      setCreationStep(4);
      if (!creationData.character && creationData.metadata) {
        await generateCharacter();
      }
    } else if (creationStep === 4) {
      updateCreationData({ character });
      setCreationStep(5);
      if (outline.length === 0 && creationData.metadata) {
        await generateOutline();
      }
    } else if (creationStep === 5) {
      updateCreationData({ outline });
      setCreationStep(6);
    } else if (creationStep === 6) {
      await startGeneratingChapters();
    }
  };

  const handleBack = () => {
    setError(null);
    if (creationStep > 1) {
      setCreationStep(creationStep - 1);
    }
  };

  const generateMetadata = async () => {
    try {
      const result = await generateMetadataMutation.mutateAsync({ concept, locale });
      updateCreationData({
        metadata: result,
      });
      if (result.category && !selectedCategory) {
        setSelectedCategory(result.category);
      }
      if (result.tags && selectedTags.length === 0) {
        setSelectedTags(result.tags);
      }
      await generateWorldviewInternal(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.generationFailed"));
    }
  };

  const generateWorldviewInternal = async (metadata?: typeof creationData.metadata) => {
    const meta = metadata || creationData.metadata;
    if (!meta) return;
    try {
      const result = await generateWorldviewMutation.mutateAsync({
        concept,
        title: meta.title,
        category: meta.category,
        tags: meta.tags,
        summary: meta.summary,
        locale,
      });
      setWorldview(result.worldview);
      updateCreationData({ worldview: result.worldview });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.generationFailed"));
    }
  };

  const generateCharacter = async () => {
    if (!creationData.metadata) return;
    try {
      const result = await generateCharacterMutation.mutateAsync({
        concept,
        title: creationData.metadata.title,
        category: creationData.metadata.category,
        tags: creationData.metadata.tags,
        summary: creationData.metadata.summary,
        worldview,
        locale,
      });
      setCharacter(result);
      updateCreationData({ character: result });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.generationFailed"));
    }
  };

  const generateOutline = async () => {
    if (!creationData.metadata) return;
    try {
      const result = await generateOutlineMutation.mutateAsync({
        concept,
        title: creationData.metadata.title,
        category: creationData.metadata.category,
        tags: creationData.metadata.tags,
        summary: creationData.metadata.summary,
        worldview,
        character,
        chapterCount: 5,
        locale,
      });
      const chaptersWithOrder = result.chapters.map((ch, idx) => ({
        ...ch,
        order: idx + 1,
      }));
      setOutline(chaptersWithOrder);
      updateCreationData({ outline: chaptersWithOrder });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.generationFailed"));
    }
  };

  const handleRetryGenerateAll = async () => {
    setError(null);
    if (creationStep === 7) {
      chapterStream.cancel();
      updateCreationData({
        generatedChapters: [],
        currentGeneratingChapter: 0,
        chapterStreamContent: "",
      });
      setTimeout(() => {
        chapterStream.startGenerating({
          mode: "full",
          concept,
          metadata: creationData.metadata!,
          worldview: creationData.worldview,
          character: creationData.character,
          chapters: outline.map((ch) => ({
            title: ch.title,
            summary: ch.summary,
          })),
          chapterIndex: 0,
          locale,
        });
      }, 100);
    }
  };

  const startGeneratingChapters = async () => {
    if (!creationData.metadata) return;
    chapterStream.cancel();
    updateCreationData({
      generatedChapters: [],
      currentGeneratingChapter: 0,
      chapterStreamContent: "",
    });
    setCreationStep(7);

    setTimeout(() => {
      chapterStream.startGenerating({
        mode: "full",
        concept,
        metadata: creationData.metadata!,
        worldview: creationData.worldview,
        character: creationData.character,
        chapters: outline.map((ch) => ({
          title: ch.title,
          summary: ch.summary,
        })),
        chapterIndex: 0,
        locale,
      });
    }, 100);
  };

  const handleCreateNovel = async () => {
    if (!creationData.metadata || !creationData.generatedChapters) return;
    setIsCreatingNovel(true);

    try {
      const result = await createNovelMutation.mutateAsync({
        title: creationData.metadata.title,
        summary: creationData.metadata.summary,
        categoryName: creationData.metadata.category,
        tags: creationData.metadata.tags,
        cover: creationData.coverUrl, // Pass AI-generated cover URL if available
        chapters: creationData.generatedChapters.map((ch) => ({
          title: ch.title,
          content: ch.content,
          order: ch.order,
        })),
      });

      const now = new Date().toISOString();
      const firstChapterContent = creationData.generatedChapters[0]?.content || "";
      
      // Create a map of order -> chapterId from the backend response
      const chapterIdMap = new Map(
        result.chapters.map((ch) => [ch.order, ch.chapterId])
      );

      const chapters = creationData.generatedChapters.map((ch) => ({
        id: chapterIdMap.get(ch.order) || generateChapterId(),
        title: ch.title,
        content: ch.content,
        order: ch.order,
        status: "draft" as const,
        wordCount: ch.wordCount,
        createdAt: now,
        updatedAt: now,
      }));

      const novel = {
        id: result.novelId,
        title: creationData.metadata.title,
        summary: creationData.metadata.summary,
        status: "DRAFT" as const,
        categoryName: creationData.metadata.category,
        wordCount: creationData.generatedChapters.reduce(
          (sum, ch) => sum + ch.wordCount,
          0
        ),
        chapters,
        createdAt: now,
        updatedAt: now,
      };

      addNovel(novel);
      // Set current chapter to the first chapter (order 1)
      const firstChapterId = chapterIdMap.get(1);
      if (firstChapterId) {
        setCurrentChapter(firstChapterId);
      }
      setEditorContent(firstChapterContent);
      setCreationMode(null);
      resetCreationFlow();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : t("guided.validation.createFailed");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsCreatingNovel(false);
    }
  };

  const handleAddChapter = () => {
    const newOrder = outline.length + 1;
    const newChapter: CreationOutlineChapter = {
      order: newOrder,
      title: "",
      summary: "",
    };
    setOutline([...outline, newChapter]);
  };

  const handleDeleteChapter = (index: number) => {
    const newOutline = outline
      .filter((_, i) => i !== index)
      .map((ch, idx) => ({ ...ch, order: idx + 1 }));
    setOutline(newOutline);
  };

  const handleMoveChapter = (index: number, direction: "up" | "down") => {
    const newOutline = [...outline];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOutline.length) return;
    [newOutline[index], newOutline[targetIdx]] = [
      newOutline[targetIdx],
      newOutline[index],
    ];
    const reordered = newOutline.map((ch, idx) => ({ ...ch, order: idx + 1 }));
    setOutline(reordered);
  };

  const handleUpdateChapter = (
    index: number,
    field: "title" | "summary",
    value: string
  ) => {
    const newOutline = [...outline];
    newOutline[index] = { ...newOutline[index], [field]: value };
    setOutline(newOutline);
  };

  const fillIdea = (idea: string) => {
    setConcept(idea);
  };

  const renderStepIndicator = () => {
    const currentStepIndex = STEPS.findIndex((s) => s.key === Math.min(creationStep, 6));
    return (
      <div className="flex items-center justify-between mb-8 px-4">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex || creationStep > 6;
          const isCurrent = idx === currentStepIndex && creationStep <= 6;
          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    isCompleted && "bg-emerald-500 text-white",
                    isCurrent && "bg-violet-500 text-white ring-4 ring-violet-100 dark:ring-violet-950",
                    !isCompleted && !isCurrent && "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 whitespace-nowrap",
                    isCurrent && "text-violet-600 font-medium dark:text-violet-400",
                    isCompleted && "text-emerald-600 dark:text-emerald-400",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {t("guided." + step.labelKey)}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5 mx-2 -mt-6",
                    idx < currentStepIndex || creationStep > 6
                      ? "bg-emerald-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t("guided.selectCategory")}</h2>
        <p className="text-muted-foreground">{t("guided.selectCategoryDesc")}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => {
              setSelectedCategory(cat.name);
              setError(null);
            }}
            className={cn(
              "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 hover:border-violet-300",
              selectedCategory === cat.name
                ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 dark:border-violet-400"
                : "border-gray-200 dark:border-gray-700"
            )}
          >
            <span className="text-3xl">{cat.emoji}</span>
            <span className="font-medium">{t(`categories.${cat.i18nKey}`)}</span>
          </button>
        ))}
      </div>
      {currentCategory && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t("guided.selectTags")}</p>
          <div className="flex flex-wrap gap-2">
            {currentCategory.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-full border transition-colors",
                  selectedTags.includes(tag)
                    ? "bg-violet-500 text-white border-violet-500"
                    : "border-gray-200 hover:border-violet-300 dark:border-gray-700"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t("guided.describeConcept")}</h2>
        <p className="text-muted-foreground">{t("guided.describeConceptDesc")}</p>
      </div>
      <div className="relative">
        <Textarea
          value={concept}
          onChange={(e) => {
            setConcept(e.target.value);
            setError(null);
          }}
          placeholder={t("guided.conceptPlaceholder")}
          className="min-h-[150px] resize-none text-base p-4"
          maxLength={500}
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          {concept.length}/500
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium">{t("guided.inspirationRef")}</span>
        </div>
        <div className="space-y-2">
          {CONCEPT_IDEAS.map((idea, idx) => (
            <button
              key={idx}
              onClick={() => fillIdea(idea)}
              className="w-full text-left p-3 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-sm transition-colors dark:bg-amber-950/20 dark:border-amber-800 dark:hover:bg-amber-950/30"
            >
              {idea}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t("guided.worldviewSetting")}</h2>
          <p className="text-muted-foreground">{t("guided.worldviewDesc")}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => generateWorldviewInternal()}
          disabled={generateWorldviewMutation.isPending}
        >
          {generateWorldviewMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          {t("regenerate")}
        </Button>
      </div>
      {generateWorldviewMutation.isPending && !worldview ? (
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700 w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
          <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700 w-5/6" />
          <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700 w-2/3" />
        </div>
      ) : (
        <Textarea
          value={worldview}
          onChange={(e) => {
            setWorldview(e.target.value);
            setError(null);
          }}
          className="min-h-[300px] resize-none text-base p-4 leading-relaxed"
          placeholder={t("guided.worldviewPlaceholder")}
        />
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t("guided.characterSetting")}</h2>
          <p className="text-muted-foreground">{t("guided.characterDesc")}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generateCharacter}
          disabled={generateCharacterMutation.isPending}
        >
          {generateCharacterMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          {t("regenerate")}
        </Button>
      </div>
      {generateCharacterMutation.isPending && !character.name ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("guided.name")}</label>
            <Input
              value={character.name}
              onChange={(e) => setCharacter({ ...character, name: e.target.value })}
              placeholder={t("guided.namePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("guided.gender")}</label>
            <Select
              value={character.gender}
              onValueChange={(v) => v && setCharacter({ ...character, gender: v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="男">{t("guided.male")}</SelectItem>
                <SelectItem value="女">{t("guided.female")}</SelectItem>
                <SelectItem value="其他">{t("guided.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("guided.age")}</label>
            <Input
              type="number"
              value={character.age}
              onChange={(e) =>
                setCharacter({ ...character, age: parseInt(e.target.value) || 18 })
              }
              min={10}
              max={100}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("guided.personality")}</label>
            <Input
              value={character.personality}
              onChange={(e) =>
                setCharacter({ ...character, personality: e.target.value })
              }
              placeholder={t("guided.personalityPlaceholder")}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">{t("guided.goal")}</label>
            <Input
              value={character.goal}
              onChange={(e) => setCharacter({ ...character, goal: e.target.value })}
              placeholder={t("guided.goalPlaceholder")}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">{t("guided.appearance")}</label>
            <Textarea
              value={character.appearance}
              onChange={(e) =>
                setCharacter({ ...character, appearance: e.target.value })
              }
              placeholder={t("guided.appearancePlaceholder")}
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">{t("guided.backgroundStory")}</label>
            <Textarea
              value={character.background}
              onChange={(e) =>
                setCharacter({ ...character, background: e.target.value })
              }
              placeholder={t("guided.backgroundPlaceholder")}
              className="min-h-[100px]"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t("guided.chapterOutline")}</h2>
          <p className="text-muted-foreground">{t("guided.chapterOutlineDesc")}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generateOutline}
          disabled={generateOutlineMutation.isPending}
        >
          {generateOutlineMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          {t("regenerate")}
        </Button>
      </div>
      {generateOutlineMutation.isPending && outline.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="space-y-3">
          {outline.map((chapter, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-medium dark:bg-violet-950/30 dark:text-violet-400">
                    {chapter.order}
                  </span>
                  <button
                    onClick={() => handleMoveChapter(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveChapter(idx, "down")}
                    disabled={idx === outline.length - 1}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    value={chapter.title}
                    onChange={(e) => handleUpdateChapter(idx, "title", e.target.value)}
                    placeholder={t("guided.chapterTitle")}
                    className="font-medium"
                  />
                  <Textarea
                    value={chapter.summary}
                    onChange={(e) =>
                      handleUpdateChapter(idx, "summary", e.target.value)
                    }
                    placeholder={t("guided.chapterSummary")}
                    className="min-h-[60px] text-sm"
                  />
                </div>
                <button
                  onClick={() => handleDeleteChapter(idx)}
                  className="p-1 text-muted-foreground hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={handleAddChapter}
            className="w-full border-dashed"
          >
            {t("guided.addChapter")}
          </Button>
        </div>
      )}
    </div>
  );

  const renderStep6 = () => {
    if (!creationData.metadata) return null;
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t("guided.confirmInfo")}</h2>
          <p className="text-muted-foreground">{t("guided.confirmInfoDesc")}</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <AICover
                title={creationData.metadata.title}
                category={creationData.metadata.category}
                size="lg"
                className="shrink-0 mx-auto sm:mx-0"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{creationData.metadata.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-violet-500">{creationData.metadata.category}</Badge>
                  {creationData.metadata.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {creationData.metadata.summary}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <button
                onClick={() => toggleSection("worldview")}
                className="w-full flex items-center justify-between py-2 hover:text-violet-600"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-violet-500" />
                  <span className="font-medium">{t("guided.worldviewSetting")}</span>
                </div>
                {expandedSections.has("worldview") ? (
                  <ChevronRight className="w-5 h-5 rotate-90" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
              {expandedSections.has("worldview") && (
                <div className="pl-7 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {worldview}
                </div>
              )}

              <Separator />

              <button
                onClick={() => toggleSection("character")}
                className="w-full flex items-center justify-between py-2 hover:text-violet-600"
              >
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-violet-500" />
                  <span className="font-medium">{t("guided.characterSetting")}</span>
                </div>
                {expandedSections.has("character") ? (
                  <ChevronRight className="w-5 h-5 rotate-90" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
              {expandedSections.has("character") && (
                <div className="pl-7 space-y-1 text-sm">
                  <p><span className="text-muted-foreground">{t("guided.nameLabel")}</span>{character.name}</p>
                  <p><span className="text-muted-foreground">{t("guided.genderLabel")}</span>{character.gender}</p>
                  <p><span className="text-muted-foreground">{t("guided.ageLabel")}</span>{character.age}</p>
                  <p><span className="text-muted-foreground">{t("guided.personalityLabel")}</span>{character.personality}</p>
                  <p><span className="text-muted-foreground">{t("guided.goalLabel")}</span>{character.goal}</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{character.background}</p>
                </div>
              )}

              <Separator />

              <button
                onClick={() => toggleSection("outline")}
                className="w-full flex items-center justify-between py-2 hover:text-violet-600"
              >
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-violet-500" />
                  <span className="font-medium">{t("guided.chapterOutlineCount", { count: outline.length })}</span>
                </div>
                {expandedSections.has("outline") ? (
                  <ChevronRight className="w-5 h-5 rotate-90" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
              {expandedSections.has("outline") && (
                <div className="pl-7 space-y-2">
                  {outline.map((ch, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-medium">{t("guided.chapterNum", { order: ch.order })} {ch.title}</p>
                      <p className="text-muted-foreground text-xs mt-1">{ch.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <p className="text-sm text-center text-muted-foreground">
          {t("guided.confirmStart")}
        </p>
      </div>
    );
  };

  const renderStep7 = () => {
    const currentChapter = creationData.currentGeneratingChapter ?? 0;
    const totalChapters = outline.length;
    const progress = Math.round(
      ((creationData.generatedChapters?.length || 0) / totalChapters) * 100
    );
    const hasError = !!chapterStream.error;

    return (
      <div className="space-y-6 py-8">
        <div className="text-center">
          {hasError ? (
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          ) : (
            <Loader2 className="w-12 h-12 animate-spin text-violet-500 mx-auto mb-4" />
          )}
          <h2 className={cn("text-2xl font-bold mb-2", hasError && "text-red-600 dark:text-red-400")}>
            {hasError ? t("guided.generationFailedTitle") : t("guided.generatingChapter", { current: currentChapter + 1, total: totalChapters })}
          </h2>
          <p className="text-muted-foreground">
            {hasError ? t("guided.generationErrorDesc") : t("guided.generationProgressDesc")}
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <div className="h-2 bg-violet-100 rounded-full overflow-hidden dark:bg-violet-950/50">
            <div
              className={cn(
                "h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500",
                hasError && "from-red-500 to-red-600"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">{progress}%</p>
        </div>
        {!hasError && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-500" />
                {outline[currentChapter]?.title || t("guided.chapterPreview")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 w-full rounded-md border p-4 bg-muted/30">
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {creationData.chapterStreamContent || t("guided.preparingGeneration")}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderStep8 = () => {
    const { metadata, generatedChapters = [] } = creationData;
    if (!metadata) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">{t("guided.generationComplete")}</h2>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {coverLoading ? (
                <div className="w-40 h-56 rounded-lg bg-muted animate-pulse shrink-0 mx-auto sm:mx-0" />
              ) : (
                <AICover
                  title={metadata.title}
                  category={metadata.category}
                  coverUrl={creationData.coverUrl}
                  size="lg"
                  className="shrink-0 mx-auto sm:mx-0"
                />
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{metadata.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-violet-500">{metadata.category}</Badge>
                  {metadata.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {metadata.summary}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-500" />
              {t("guided.chapterList")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {generatedChapters.map((chapter, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-medium dark:bg-violet-950/30 dark:text-violet-400">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-medium">{chapter.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {t("guided.wordsCount", { count: chapter.wordCount })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => setCreationStep(6)} disabled={isCreatingNovel}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t("guided.goBack")}
          </Button>
          <Button
            onClick={handleCreateNovel}
            disabled={isCreatingNovel}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
          >
            {isCreatingNovel ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <BookOpen className="w-4 h-4 mr-2" />
            )}
            {t("guided.enterEditor")}
          </Button>
        </div>
      </div>
    );
  };

  const loginLinkClass = "inline-flex items-center justify-center gap-1 rounded-lg border bg-white px-2.5 h-7 text-[0.8rem] border-red-300 text-red-700 hover:bg-red-50 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300";

  return (
    <div className="min-h-[600px] p-6">
      <div className="max-w-4xl mx-auto">
        {creationStep <= 6 && renderStepIndicator()}

        {(error ||
          (creationStep === 3 && generateWorldviewMutation.error) ||
          (creationStep === 4 && generateCharacterMutation.error) ||
          (creationStep === 5 && generateOutlineMutation.error) ||
          (creationStep === 7 && chapterStream.error)) && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{t("guided.operationFailed")}</h4>
                <p className="text-sm mb-3">
                  {getErrorMessage(
                    error ||
                      (creationStep === 3 && generateWorldviewMutation.error?.message) ||
                      (creationStep === 4 && generateCharacterMutation.error?.message) ||
                      (creationStep === 5 && generateOutlineMutation.error?.message) ||
                      chapterStream.error,
                    t("common.generationFailed"),
                    t("common.loginRequired")
                  )}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {isUnauthorizedError(
                    error ||
                      generateWorldviewMutation.error?.message ||
                      generateCharacterMutation.error?.message ||
                      generateOutlineMutation.error?.message ||
                      chapterStream.error
                  ) ? (
                    <Link
                      href="/login"
                      className={loginLinkClass}
                    >
                      {t("guided.goLogin")}
                    </Link>
                  ) : (
                    <>
                      {creationStep === 3 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateWorldviewInternal()}
                          className="bg-white border-red-300 text-red-700 hover:bg-red-50 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          {t("guided.retryWorldview")}
                        </Button>
                      )}
                      {creationStep === 4 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateCharacter}
                          className="bg-white border-red-300 text-red-700 hover:bg-red-50 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          {t("guided.retryCharacter")}
                        </Button>
                      )}
                      {creationStep === 5 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateOutline}
                          className="bg-white border-red-300 text-red-700 hover:bg-red-50 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          {t("guided.retryOutline")}
                        </Button>
                      )}
                      {creationStep === 7 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRetryGenerateAll}
                          className="bg-white border-red-300 text-red-700 hover:bg-red-50 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          {t("guided.retryGeneration")}
                        </Button>
                      )}
                      {creationStep === 7 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            chapterStream.cancel();
                            setCreationStep(6);
                          }}
                          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          {t("guided.goBack")}
                        </Button>
                      )}
                      {creationStep <= 6 && error && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setError(null)}
                          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                        >
                          <X className="w-4 h-4 mr-1" />
                          {t("guided.close")}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <Card className="mb-6">
          <CardContent className="p-6">
            {creationStep === 1 && renderStep1()}
            {creationStep === 2 && renderStep2()}
            {creationStep === 3 && renderStep3()}
            {creationStep === 4 && renderStep4()}
            {creationStep === 5 && renderStep5()}
            {creationStep === 6 && renderStep6()}
            {creationStep === 7 && renderStep7()}
            {creationStep === 8 && renderStep8()}
          </CardContent>
        </Card>

        {creationStep <= 6 && (
          <div className="flex justify-between">
            {creationStep === 1 ? (
              <Button
                variant="outline"
                onClick={() => {
                  if (onClose) onClose();
                  else resetCreationFlow();
                }}
              >
                <X className="w-4 h-4 mr-2" />
                {t("guided.exitCreation")}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleBack}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                {t("guided.previous")}
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={
                generateMetadataMutation.isPending ||
                generateWorldviewMutation.isPending ||
                generateCharacterMutation.isPending ||
                generateOutlineMutation.isPending ||
                !!error
              }
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
            >
              {creationStep === 6 ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t("guided.startGenerate")}
                </>
              ) : (
                <>
                  {t("guided.next")}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
