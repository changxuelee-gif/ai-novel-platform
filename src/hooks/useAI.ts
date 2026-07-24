"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { trpc } from "@/trpc/client";

// ─── 通用返回类型 ────────────────────────────────────────────────────────────

interface UseAIResult<T> {
  generate: (input: T) => void;
  loading: boolean;
  error: string | null;
  result: string | null;
  reset: () => void;
}

// ─── useAIContinue ────────────────────────────────────────────────────────────

interface ContinueInput {
  context: string;
  character?: string;
  style?: string;
}

export function useAIContinue(): UseAIResult<ContinueInput> {
  const mutation = trpc.ai.continue.useMutation();
  const [result, setResult] = useState<string | null>(null);

  const generate = useCallback(
    (input: ContinueInput) => {
      mutation.mutate(input, {
        onSuccess: (data) => setResult(data.content),
        onError: () => {},
      });
    },
    [mutation],
  );

  return {
    generate,
    loading: mutation.isPending,
    error: mutation.error?.message ?? null,
    result,
    reset: () => {
      setResult(null);
      mutation.reset();
    },
  };
}

// ─── useAIInspire ─────────────────────────────────────────────────────────────

interface InspireInput {
  chapterContent: string;
  setting?: string;
}

export function useAIInspire(): UseAIResult<InspireInput> {
  const mutation = trpc.ai.inspire.useMutation();
  const [result, setResult] = useState<string | null>(null);

  const generate = useCallback(
    (input: InspireInput) => {
      mutation.mutate(input, {
        onSuccess: (data) => setResult(data.suggestions),
        onError: () => {},
      });
    },
    [mutation],
  );

  return {
    generate,
    loading: mutation.isPending,
    error: mutation.error?.message ?? null,
    result,
    reset: () => {
      setResult(null);
      mutation.reset();
    },
  };
}

// ─── useAIRewrite ─────────────────────────────────────────────────────────────

type RewriteMode = "vivid" | "concise" | "academic" | "colloquial";

interface RewriteInput {
  text: string;
  mode: RewriteMode;
}

export function useAIRewrite(): UseAIResult<RewriteInput> {
  const mutation = trpc.ai.rewrite.useMutation();
  const [result, setResult] = useState<string | null>(null);

  const generate = useCallback(
    (input: RewriteInput) => {
      mutation.mutate(input, {
        onSuccess: (data) => setResult(data.content),
        onError: () => {},
      });
    },
    [mutation],
  );

  return {
    generate,
    loading: mutation.isPending,
    error: mutation.error?.message ?? null,
    result,
    reset: () => {
      setResult(null);
      mutation.reset();
    },
  };
}

// ─── useAIDialogue ────────────────────────────────────────────────────────────

interface DialogueCharacter {
  name: string;
  personality: string;
}

interface DialogueInput {
  characters: DialogueCharacter[];
  situation: string;
}

export function useAIDialogue(): UseAIResult<DialogueInput> {
  const mutation = trpc.ai.dialogue.useMutation();
  const [result, setResult] = useState<string | null>(null);

  const generate = useCallback(
    (input: DialogueInput) => {
      mutation.mutate(input, {
        onSuccess: (data) => setResult(data.content),
        onError: () => {},
      });
    },
    [mutation],
  );

  return {
    generate,
    loading: mutation.isPending,
    error: mutation.error?.message ?? null,
    result,
    reset: () => {
      setResult(null);
      mutation.reset();
    },
  };
}

// ─── useAIOutline ─────────────────────────────────────────────────────────────

interface OutlineInput {
  worldView: string;
  protagonist: string;
  conflict: string;
}

export function useAIOutline(): UseAIResult<OutlineInput> {
  const mutation = trpc.ai.outline.useMutation();
  const [result, setResult] = useState<string | null>(null);

  const generate = useCallback(
    (input: OutlineInput) => {
      mutation.mutate(input, {
        onSuccess: (data) => setResult(data.content),
        onError: () => {},
      });
    },
    [mutation],
  );

  return {
    generate,
    loading: mutation.isPending,
    error: mutation.error?.message ?? null,
    result,
    reset: () => {
      setResult(null);
      mutation.reset();
    },
  };
}

// ─── useAIStream ──────────────────────────────────────────────────────────────

interface UseAIStreamResult {
  startStream: (params: Record<string, string>) => void;
  stopStream: () => void;
  chunks: string;
  loading: boolean;
  error: string | null;
}

export function useAIStream(): UseAIStreamResult {
  const [chunks, setChunks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const stopStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setLoading(false);
  }, []);

  const startStream = useCallback(
    (params: Record<string, string>) => {
      // 关闭已有连接
      stopStream();

      // 构建 URL
      const url = new URL("/api/ai/stream", window.location.origin);
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
      }

      setChunks("");
      setError(null);
      setLoading(true);

      const eventSource = new EventSource(url.toString());
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        const data = event.data;

        // 流结束标记
        if (data === "[DONE]") {
          stopStream();
          return;
        }

        // 错误消息（服务端发送 JSON 格式错误）
        if (data.startsWith("{")) {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              setError(parsed.error);
              stopStream();
            }
            return;
          } catch {
            // 非 JSON，当作普通文本累加
          }
        }

        // 正常文本累加
        setChunks((prev) => prev + data);
      };

      eventSource.onerror = () => {
        setError("连接中断，请重试");
        stopStream();
      };
    },
    [stopStream],
  );

  // 组件卸载时自动清理
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  return { startStream, stopStream, chunks, loading, error };
}
