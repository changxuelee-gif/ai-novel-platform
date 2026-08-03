"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { trpc } from "@/trpc/client";
import type {
  CreationMetadata,
  CreationCharacter,
  CreationOutlineChapter,
} from "@/stores/useCreateStore";

type QuickCreateStep = "idle" | "metadata" | "worldview" | "character" | "outline" | "chapters" | "done";

interface QuickCreateData {
  metadata: CreationMetadata;
  worldview: string;
  character: CreationCharacter;
  outline: CreationOutlineChapter[];
}

interface UseQuickCreateResult {
  generate: (concept: string, locale?: string) => void;
  loading: boolean;
  error: string | null;
  data: QuickCreateData | null;
  reset: () => void;
  currentStep: QuickCreateStep;
}

const isAuthError = (message: string) => {
  return message.includes("UNAUTHORIZED") || message.includes("未登录") || message.includes("401") || message.includes("Not authenticated");
};

export function useQuickCreate(): UseQuickCreateResult {
  const [data, setData] = useState<QuickCreateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<QuickCreateStep>("idle");
  const cancelledRef = useRef(false);

  const metadataMutation = trpc.creation.generateMetadata.useMutation();
  const worldviewMutation = trpc.creation.generateWorldview.useMutation();
  const characterMutation = trpc.creation.generateCharacter.useMutation();
  const outlineMutation = trpc.creation.generateOutline.useMutation();

  const reset = useCallback(() => {
    cancelledRef.current = true;
    setLoading(false);
    setError(null);
    setData(null);
    setCurrentStep("idle");
    metadataMutation.reset();
    worldviewMutation.reset();
    characterMutation.reset();
    outlineMutation.reset();
  }, [metadataMutation, worldviewMutation, characterMutation, outlineMutation]);

  const generate = useCallback(
    async (concept: string, locale?: string) => {
      cancelledRef.current = false;
      setLoading(true);
      setError(null);
      setData(null);

      try {
        // Step 1: Generate metadata
        setCurrentStep("metadata");
        const metadata = await metadataMutation.mutateAsync({ concept, locale });
        if (cancelledRef.current) return;

        // Step 2: Generate worldview
        setCurrentStep("worldview");
        const worldviewResult = await worldviewMutation.mutateAsync({
          concept,
          title: metadata.title,
          category: metadata.category,
          tags: metadata.tags,
          summary: metadata.summary,
          locale,
        });
        if (cancelledRef.current) return;

        // Step 3: Generate character
        setCurrentStep("character");
        const character = await characterMutation.mutateAsync({
          concept,
          title: metadata.title,
          category: metadata.category,
          tags: metadata.tags,
          summary: metadata.summary,
          worldview: worldviewResult.worldview,
          locale,
        });
        if (cancelledRef.current) return;

        // Step 4: Generate outline (3 chapters for quick mode)
        setCurrentStep("outline");
        const outlineResult = await outlineMutation.mutateAsync({
          concept,
          title: metadata.title,
          category: metadata.category,
          tags: metadata.tags,
          summary: metadata.summary,
          worldview: worldviewResult.worldview,
          character,
          chapterCount: 3,
          locale,
        });
        if (cancelledRef.current) return;

        setCurrentStep("chapters");
        setData({
          metadata,
          worldview: worldviewResult.worldview,
          character,
          outline: outlineResult.chapters.slice(0, 3),
        });
      } catch (err) {
        if (cancelledRef.current) return;
        const message = err instanceof Error ? err.message : "生成失败，请重试";
        if (isAuthError(message)) {
          setError("请先登录后使用AI创作");
        } else {
          setError(message);
        }
        setLoading(false);
        setCurrentStep("idle");
      }
    },
    [metadataMutation, worldviewMutation, characterMutation, outlineMutation]
  );

  // When data is set and we're in chapters step, mark loading as done when chapters start streaming
  useEffect(() => {
    if (data && currentStep === "chapters") {
      setLoading(false);
      setCurrentStep("done");
    }
  }, [data, currentStep]);

  return {
    generate,
    loading: loading || currentStep === "chapters",
    error,
    data,
    reset,
    currentStep,
  };
}

interface ChapterStreamParams {
  mode: "full" | "quick";
  concept?: string;
  metadata: CreationMetadata;
  worldview?: string;
  character?: CreationCharacter;
  chapters: Array<{ title: string; summary: string }>;
  chapterIndex: number;
  previousSummary?: string;
  locale?: string;
}

interface UseChapterStreamOptions {
  onChapterComplete?: (chapterContent: string, chapterIndex: number) => void;
  autoContinue?: boolean;
}

interface UseChapterStreamResult {
  startGenerating: (params: ChapterStreamParams) => void;
  cancel: () => void;
  content: string;
  loading: boolean;
  error: string | null;
  currentChapter: number;
  completed: boolean;
}

export function useChapterStream(
  options: UseChapterStreamOptions = {}
): UseChapterStreamResult {
  const { onChapterComplete, autoContinue = false } = options;

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [completed, setCompleted] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const onChapterCompleteRef = useRef(onChapterComplete);
  const autoContinueRef = useRef(autoContinue);

  useEffect(() => {
    onChapterCompleteRef.current = onChapterComplete;
  }, [onChapterComplete]);

  useEffect(() => {
    autoContinueRef.current = autoContinue;
  }, [autoContinue]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  }, []);

  const streamChapter = useCallback(
    async (params: ChapterStreamParams) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      setContent("");
      setError(null);
      setLoading(true);
      setCompleted(false);
      setCurrentChapter(params.chapterIndex);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const runStream = async (streamParams: ChapterStreamParams) => {
        try {
          const response = await fetch("/api/ai/generate-chapter", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(streamParams),
            signal: abortController.signal,
          });

          if (!response.ok) {
            let errorMsg = `请求失败: ${response.status}`;
            try {
              const errorData = await response.json();
              errorMsg = errorData.error || errorMsg;
            } catch {
              // ignore
            }
            throw new Error(errorMsg);
          }

          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("响应体不可读");
          }

          const decoder = new TextDecoder();
          let buffer = "";
          let chapterContent = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;

              const dataStr = trimmed.slice(5).trim();
              if (dataStr === "[DONE]") {
                if (onChapterCompleteRef.current) {
                  onChapterCompleteRef.current(
                    chapterContent,
                    streamParams.chapterIndex
                  );
                }

                const nextChapterIndex = streamParams.chapterIndex + 1;
                const hasMoreChapters =
                  nextChapterIndex < streamParams.chapters.length;

                if (autoContinueRef.current && hasMoreChapters) {
                  const nextParams: ChapterStreamParams = {
                    ...streamParams,
                    chapterIndex: nextChapterIndex,
                    previousSummary: chapterContent.slice(-500),
                  };
                  setContent("");
                  setCurrentChapter(nextChapterIndex);
                  runStream(nextParams);
                } else if (!hasMoreChapters) {
                  setCompleted(true);
                  setLoading(false);
                  if (abortControllerRef.current === abortController) {
                    abortControllerRef.current = null;
                  }
                } else {
                  setLoading(false);
                  if (abortControllerRef.current === abortController) {
                    abortControllerRef.current = null;
                  }
                }
                return;
              }

              if (dataStr.startsWith("{")) {
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.error) {
                    setError(parsed.error);
                    setLoading(false);
                    if (abortControllerRef.current === abortController) {
                      abortControllerRef.current = null;
                    }
                    return;
                  }
                } catch {
                  // Not JSON error, treat as content
                }
              }

              chapterContent += dataStr;
              setContent(chapterContent);
            }
          }
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            return;
          }
          const message =
            err instanceof Error ? err.message : "连接中断，请重试";
          setError(message);
          setLoading(false);
          if (abortControllerRef.current === abortController) {
            abortControllerRef.current = null;
          }
        }
      };

      runStream(params);
    },
    []
  );

  const startGenerating = useCallback(
    (params: ChapterStreamParams) => {
      streamChapter(params);
    },
    [streamChapter]
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  return {
    startGenerating,
    cancel,
    content,
    loading,
    error,
    currentChapter,
    completed,
  };
}
