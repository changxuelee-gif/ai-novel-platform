"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UseAIPostStreamResult {
  startStream: (params: Record<string, string>) => void;
  stopStream: () => void;
  chunks: string;
  loading: boolean;
  error: string | null;
}

export function useAIPostStream(): UseAIPostStreamResult {
  const [chunks, setChunks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  }, []);

  const startStream = useCallback(
    async (params: Record<string, string>) => {
      stopStream();

      setChunks("");
      setError(null);
      setLoading(true);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const response = await fetch("/api/ai/stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
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

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;

            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") {
              setLoading(false);
              return;
            }

            if (data.startsWith("{")) {
              try {
                const parsed = JSON.parse(data);
                if (parsed.error) {
                  setError(parsed.error);
                  setLoading(false);
                  return;
                }
              } catch {
              }
            }

            setChunks((prev) => prev + data);
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const message = err instanceof Error ? err.message : "连接中断，请重试";
        setError(message);
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [stopStream],
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  return { startStream, stopStream, chunks, loading, error };
}
