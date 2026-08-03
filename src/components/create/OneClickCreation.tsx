"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  X,
  RefreshCw,
  Pencil,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { buildPreviousSummary, generateChapterId } from "@/lib/ai/chapter-utils";
import { useCreateStore } from "@/stores/useCreateStore";
import { useQuickCreate, useChapterStream } from "@/hooks/useCreation";
import { AICover } from "./AICover";
import { trpc } from "@/trpc/client";
import { Link } from "@/i18n/navigation";

const isUnauthorizedError = (message: string | null | undefined) => {
  if (!message) return false;
  return message.includes("UNAUTHORIZED") || message.includes("未登录") || message.includes("401");
};

const QUICK_IDEAS = [
  "一个普通少年意外获得上古传承，踏上修仙之路",
  "未来世界，AI拥有情感，人类与AI的爱情故事",
  "重生回到高中，用未来知识改变命运",
  "都市白领意外穿越到古代，用现代智慧搅弄风云",
];

interface StepStatus {
  label: string;
  status: "pending" | "loading" | "done";
  subSteps?: { label: string; status: "pending" | "loading" | "done" }[];
}

interface OneClickCreationProps {
  onClose?: () => void;
}

export function OneClickCreation({ onClose }: OneClickCreationProps) {
  const t = useTranslations("create");
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
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    new Set()
  );
  const [isCreatingNovel, setIsCreatingNovel] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const quickCreate = useQuickCreate();
  const chapterStream = useChapterStream({ autoContinue: true });
  const createNovelMutation = trpc.creation.createNovelWithAI.useMutation();
  const generateCoverMutation = trpc.creation.generateCover.useMutation();

  // Trigger cover generation when entering the completion page (step 3)
  useEffect(() => {
    if (creationStep === 3 && creationData.metadata && !creationData.coverUrl && !coverLoading && !coverError) {
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
            toast.error(t("oneClick.coverFailed"));
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
      if (nextIdx < 3 && creationData.metadata && creationData.outline) {
        setTimeout(() => {
          const previousSummary = buildPreviousSummary(chaptersForSummary);

          updateCreationData({
            currentGeneratingChapter: nextIdx,
            chapterStreamContent: "",
          });
          chapterStream.startGenerating({
            mode: "quick",
            concept: creationData.concept || concept,
            metadata: creationData.metadata!,
            worldview: creationData.worldview,
            character: creationData.character,
            chapters: creationData.outline!.slice(0, 3).map((ch) => ({
              title: ch.title,
              summary: ch.summary,
            })),
            chapterIndex: nextIdx,
            previousSummary,
          });
        }, 100);
      } else {
        setCreationStep(3);
      }
    }
  }, [chapterStream.completed]);

  useEffect(() => {
    if (quickCreate.data) {
      const { metadata, worldview, character, outline } = quickCreate.data;
      updateCreationData({
        metadata,
        worldview,
        character,
        outline: outline.slice(0, 3),
        generatedChapters: [],
        currentGeneratingChapter: 0,
        chapterStreamContent: "",
      });

      setTimeout(() => {
        chapterStream.startGenerating({
          mode: "quick",
          concept,
          metadata,
          worldview,
          character,
          chapters: outline.slice(0, 3).map((ch) => ({
            title: ch.title,
            summary: ch.summary,
          })),
          chapterIndex: 0,
        });
      }, 100);
    }
  }, [quickCreate.data]);

  const handleStartGenerate = () => {
    if (concept.length < 5 || concept.length > 500) return;
    quickCreate.reset();
    chapterStream.cancel();
    updateCreationData({ concept });
    setCreationStep(1);
    quickCreate.generate(concept);
  };

  const handleRetryQuickCreate = () => {
    quickCreate.reset();
    chapterStream.cancel();
    quickCreate.generate(concept);
  };

  const handleBackToEdit = () => {
    chapterStream.cancel();
    quickCreate.reset();
    setCreationStep(0);
  };

  const handleCancel = () => {
    chapterStream.cancel();
    quickCreate.reset();
    if (onClose) {
      onClose();
    } else {
      resetCreationFlow();
    }
    setConcept("");
  };

  const handleRegenerate = () => {
    chapterStream.cancel();
    quickCreate.reset();
    updateCreationData({
      metadata: undefined,
      worldview: undefined,
      character: undefined,
      outline: undefined,
      generatedChapters: [],
      currentGeneratingChapter: undefined,
      chapterStreamContent: "",
    });
    setCreationStep(0);
  };

  const handleStartWriting = async () => {
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
    } catch (error) {
      console.error("Failed to create novel:", error);
      toast.error(
        error instanceof Error ? error.message : t("oneClick.saveFailed")
      );
    } finally {
      setIsCreatingNovel(false);
    }
  };

  const toggleChapter = (idx: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const getSteps = (): StepStatus[] => {
    const { currentStep } = quickCreate;
    const hasMetadata = !!creationData.metadata;
    const hasWorldview = !!creationData.worldview;
    const hasCharacter = !!creationData.character;
    const hasOutline = !!creationData.outline;
    const chapters = creationData.generatedChapters || [];
    const currentChapter = creationData.currentGeneratingChapter ?? 0;
    const isStepDone = (step: string) => {
      const stepOrder = ["metadata", "worldview", "character", "outline", "chapters"];
      const currentIdx = stepOrder.indexOf(currentStep);
      const stepIdx = stepOrder.indexOf(step);
      return currentIdx > stepIdx || (currentStep === "done");
    };
    const isStepLoading = (step: string) => currentStep === step;

    return [
      {
        label: "生成作品信息",
        status: hasMetadata || isStepDone("metadata") ? "done" : isStepLoading("metadata") ? "loading" : "pending",
      },
      {
        label: "构建世界观",
        status: hasWorldview || isStepDone("worldview")
          ? "done"
          : isStepLoading("worldview")
          ? "loading"
          : "pending",
      },
      {
        label: "设计人物",
        status: hasCharacter || isStepDone("character")
          ? "done"
          : isStepLoading("character")
          ? "loading"
          : "pending",
      },
      {
        label: "生成大纲",
        status: hasOutline || isStepDone("outline")
          ? "done"
          : isStepLoading("outline")
          ? "loading"
          : "pending",
      },
      {
        label: "撰写正文",
        status: chapters.length >= 3
          ? "done"
          : hasOutline || isStepDone("outline") || isStepLoading("chapters") || chapterStream.loading
          ? "loading"
          : "pending",
        subSteps: [0, 1, 2].map((i) => ({
          label: `第${i + 1}章`,
          status:
            i < chapters.length
              ? "done"
              : i === currentChapter && chapterStream.loading
              ? "loading"
              : "pending",
        })),
      },
    ];
  };

  const calculateProgress = () => {
    const steps = getSteps();
    let total = 0;
    let completed = 0;

    steps.forEach((step, idx) => {
      if (idx < 4) {
        total += 1;
        if (step.status === "done") completed += 1;
      } else {
        total += 3;
        const chapters = creationData.generatedChapters || [];
        completed += chapters.length;
        if (chapterStream.loading) completed += 0.5;
      }
    });

    return Math.min(100, Math.round((completed / total) * 100));
  };

  if (creationStep === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px] p-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {t("oneClick.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="relative">
              <Textarea
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder={t("oneClick.placeholder")}
                className="min-h-[120px] resize-none text-base p-4"
                maxLength={500}
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {concept.length}/500
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("oneClick.tryInspiration")}
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_IDEAS.map((idea, idx) => (
                  <button
                    key={idx}
                    onClick={() => setConcept(idea)}
                    className="px-3 py-1.5 text-sm rounded-full border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 hover:border-violet-300 transition-colors dark:bg-violet-950/30 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-900/30"
                  >
                    {idea.length > 20 ? idea.slice(0, 20) + "..." : idea}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleStartGenerate}
              disabled={concept.length < 5 || concept.length > 500}
              className="w-full py-6 text-base bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {t("oneClick.generate")}
            </Button>

            {quickCreate.error && (
              <div className="text-sm text-red-500 text-center">
                {quickCreate.error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (creationStep === 1) {
    const steps = getSteps();
    const progress = calculateProgress();
    const hasQuickCreateError = !!quickCreate.error;
    const hasChapterStreamError = !!chapterStream.error;
    const hasAnyError = hasQuickCreateError || hasChapterStreamError;
    const currentError = quickCreate.error || chapterStream.error;
    const errorMessage = !currentError
      ? t("oneClick.generationFailed")
      : isUnauthorizedError(currentError)
      ? t("oneClick.loginToUse")
      : currentError;
    const isAuthError = isUnauthorizedError(currentError);

    return (
      <div className="min-h-[600px] p-6">
        <div className="max-w-5xl mx-auto">
          {hasAnyError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">生成失败</h4>
                  <p className="text-sm mb-3">{errorMessage}</p>
                  <div className="flex gap-2">
                    {isAuthError ? (
                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-1 rounded-lg border bg-white px-2.5 h-7 text-[0.8rem] border-red-300 text-red-700 hover:bg-red-50 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
                      >
                        去登录
                      </Link>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetryQuickCreate}
                        className="bg-white border-red-300 text-red-700 hover:bg-red-50 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        {t("oneClick.retry")}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBackToEdit}
                      className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      {t("oneClick.goBack")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {t("oneClick.generationProgress")}
              </span>
              <span className="text-sm font-medium text-violet-600">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-violet-100 rounded-full overflow-hidden dark:bg-violet-950/50">
              <div
                className={cn(
                  "h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500",
                  hasAnyError && "from-red-500 to-red-600"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("oneClick.generationSteps")}
              </h3>
              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                          step.status === "done" &&
                            "bg-emerald-500 text-white",
                          step.status === "loading" && !hasAnyError &&
                            "bg-violet-500 text-white",
                          step.status === "loading" && hasAnyError &&
                            "bg-red-500 text-white",
                          step.status === "pending" &&
                            "bg-gray-200 text-gray-400 dark:bg-gray-700"
                        )}
                      >
                        {step.status === "done" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : step.status === "loading" && hasAnyError ? (
                          <X className="w-4 h-4" />
                        ) : step.status === "loading" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <span className="text-xs">{idx + 1}</span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          step.status === "done" &&
                            "text-emerald-600 dark:text-emerald-400",
                          step.status === "loading" && !hasAnyError &&
                            "text-violet-600 dark:text-violet-400 font-medium",
                          step.status === "loading" && hasAnyError &&
                            "text-red-600 dark:text-red-400 font-medium",
                          step.status === "pending" && "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                    {step.subSteps && (
                      <div className="ml-9 mt-2 space-y-2">
                        {step.subSteps.map((subStep, subIdx) => (
                          <div key={subIdx} className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                                subStep.status === "done" &&
                                  "bg-emerald-500/20",
                                subStep.status === "loading" && !hasAnyError &&
                                  "bg-violet-500/20",
                                subStep.status === "loading" && hasAnyError &&
                                  "bg-red-500/20",
                                subStep.status === "pending" && "bg-gray-100 dark:bg-gray-800"
                              )}
                            >
                              {subStep.status === "done" ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              ) : subStep.status === "loading" && hasAnyError ? (
                                <X className="w-3 h-3 text-red-500" />
                              ) : subStep.status === "loading" ? (
                                <Loader2 className="w-3 h-3 text-violet-500 animate-spin" />
                              ) : null}
                            </div>
                            <span
                              className={cn(
                                "text-xs",
                                subStep.status === "done" &&
                                  "text-emerald-600 dark:text-emerald-400",
                                subStep.status === "loading" && !hasAnyError &&
                                  "text-violet-600 dark:text-violet-400",
                                subStep.status === "loading" && hasAnyError &&
                                  "text-red-600 dark:text-red-400",
                                subStep.status === "pending" &&
                                  "text-muted-foreground"
                              )}
                            >
                              {subStep.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t space-y-2">
                {!hasAnyError && (
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {t("oneClick.cancelGeneration")}
                  </Button>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("oneClick.livePreview")}
              </h3>
              {creationData.metadata && !hasAnyError ? (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <AICover
                      title={creationData.metadata.title}
                      category={creationData.metadata.category}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg truncate">
                        {creationData.metadata.title}
                      </h4>
                      <Badge variant="secondary" className="mt-1">
                        {creationData.metadata.category}
                      </Badge>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {creationData.metadata.tags
                          .slice(0, 3)
                          .map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-violet-500" />
                      <span className="text-sm font-medium">
                        {t("oneClick.writingChapter", { chapter: (creationData.currentGeneratingChapter ?? 0) + 1 })}
                      </span>
                    </div>
                    <ScrollArea className="h-64 w-full rounded-md border p-4 bg-muted/30">
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {creationData.chapterStreamContent ||
                          t("oneClick.waitingContent")}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              ) : hasAnyError ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <AlertCircle className="w-8 h-8 mb-4 text-red-500" />
                  <p className="text-red-600 dark:text-red-400">{t("oneClick.generationError")}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-violet-500" />
                  <p>{t("oneClick.preparing")}</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (creationStep === 3) {
    const { metadata, generatedChapters = [] } = creationData;
    if (!metadata) return null;

    return (
      <div className="min-h-[600px] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 dark:bg-emerald-950/30 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold">
              {t("oneClick.completed")}
            </h2>
          </div>

          <Card className="mb-6">
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

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-500" />
                {t("oneClick.chapterPreview")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {generatedChapters.map((chapter, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleChapter(idx)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-medium dark:bg-violet-950/30 dark:text-violet-400">
                        {idx + 1}
                      </span>
                      <div className="text-left">
                        <div className="font-medium">{chapter.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {chapter.wordCount} {t("oneClick.words")}
                        </div>
                      </div>
                    </div>
                    {expandedChapters.has(idx) ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedChapters.has(idx) && (
                    <div className="px-4 pb-4 pt-0 border-t">
                      <ScrollArea className="h-64 w-full">
                        <div className="text-sm leading-relaxed whitespace-pre-wrap py-4 pr-4">
                          {chapter.content}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={isCreatingNovel}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t("oneClick.regenerate")}
            </Button>
            <Button
              onClick={handleStartWriting}
              disabled={isCreatingNovel}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
            >
              {isCreatingNovel ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <BookOpen className="w-4 h-4 mr-2" />
              )}
              {t("oneClick.enterEditor")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
