"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { trpc } from "@/trpc/client";
import type {
  CreationMetadata,
  CreationCharacter,
  CreationOutlineChapter,
} from "@/stores/useCreateStore";

interface QuickCreateData {
  metadata: CreationMetadata;
  worldview: string;
  character: CreationCharacter;
  outline: CreationOutlineChapter[];
}

interface UseQuickCreateResult {
  generate: (concept: string) => void;
  loading: boolean;
  error: string | null;
  data: QuickCreateData | null;
  reset: () => void;
}

export function useQuickCreate(): UseQuickCreateResult {
  const mutation = trpc.creation.quickCreateNovel.useMutation();
  const [data, setData] = useState<QuickCreateData | null>(null);

  const generate = useCallback(
    (concept: string) => {
      mutation.mutate(
        { concept },
        {
          onSuccess: (result) => {
            setData({
              metadata: result.metadata,
              worldview: result.worldview,
              character: result.character,
              outline: result.outline,
            });
          },
          onError: () => {},
        }
      );
    },
    [mutation]
  );

  const reset = useCallback(() => {
    setData(null);
    mutation.reset();
  }, [mutation]);

  return {
    generate,
    loading: mutation.isPending,
    error: mutation.error?.message ?? null,
    data,
    reset,
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
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `请求失败: ${response.status}`);
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
                  // Not JSON, treat as text
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
