import type { AIClient, AICompleteParams, ImageGenerationParams } from "./types";

const DASHSCOPE_API_URL =
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const DASHSCOPE_IMAGE_API_URL =
  "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis";
const DASHSCOPE_TASK_API_URL =
  "https://dashscope.aliyuncs.com/api/v1/tasks";
// Quality model for short/fast tasks (metadata, etc.) - stays within 10s Netlify limit
const QUALITY_MODEL = "qwen-plus";
// Fast model for long-running tasks (configured via AI_MODEL env var, falls back to qwen-turbo)
const FAST_MODEL = process.env.AI_MODEL || "qwen-turbo";
// Image generation model (wanx2.1-t2i-turbo for fast generation)
const IMAGE_MODEL = "wanx2.1-t2i-turbo";
const DEFAULT_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS) || 25000; // 25s default (Netlify Pro=26s); free tier 10s limit handled by fast model selection
const IMAGE_POLL_INTERVAL_MS = 2000; // 2s poll interval
const IMAGE_MAX_POLLS = 30; // 60s total timeout

export class QwenClient implements AIClient {
  private apiKey: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY || process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Missing OPENAI_API_KEY or DASHSCOPE_API_KEY environment variable. Please set it in your .env file."
      );
    }
    this.apiKey = apiKey;
  }

  private buildRequestBody(params: AICompleteParams, stream = false) {
    const messages: Array<{ role: string; content: string }> = [];

    let systemContent = params.systemPrompt || params.context || "";
    if (params.jsonMode) {
      systemContent = systemContent
        ? `${systemContent}\n\n请以JSON格式输出`
        : "请以JSON格式输出";
    }

    if (systemContent) {
      messages.push({ role: "system", content: systemContent });
    }

    messages.push({ role: "user", content: params.prompt });

    // Select model: explicit model param > useFastModel > default quality model
    let selectedModel = params.model;
    if (!selectedModel) {
      selectedModel = params.useFastModel ? FAST_MODEL : QUALITY_MODEL;
    }

    const body: Record<string, unknown> = {
      model: selectedModel,
      messages,
      temperature: params.temperature ?? 0.7,
      max_tokens: params.maxTokens ?? 2048,
      stream,
    };

    if (params.jsonMode) {
      body.response_format = { type: "json_object" };
    }

    return body;
  }

  private buildHeaders() {
    return {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async complete(params: AICompleteParams): Promise<string> {
    const body = this.buildRequestBody(params);
    const timeoutMs = params.timeoutMs || DEFAULT_TIMEOUT_MS;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetch(DASHSCOPE_API_URL, {
        method: "POST",
        headers: this.buildHeaders(),
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(`AI request timed out after ${timeoutMs / 1000}s. Please try again.`);
      }
      throw new Error(`AI API network error: unable to connect`);
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorText = "Unknown error";
      try {
        errorText = await response.text();
      } catch {
        // ignore
      }
      console.error(`[QwenClient] API error ${response.status}: ${errorText.slice(0, 500)}`);
      throw new Error(
        `AI API request failed (${response.status}): ${errorText.slice(0, 300)}`
      );
    }

    let data: { choices?: Array<{ message?: { content?: string } }> };
    try {
      data = await response.json();
    } catch {
      throw new Error("AI API returned invalid JSON response");
    }

    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      console.error("[QwenClient] Unexpected API response structure:", JSON.stringify(data).slice(0, 500));
      throw new Error("AI API returned unexpected response format");
    }

    return content;
  }

  async *completeStream(
    params: AICompleteParams
  ): AsyncIterable<string> {
    const body = this.buildRequestBody(params, true);
    const timeoutMs = (params.timeoutMs || DEFAULT_TIMEOUT_MS) * 2; // longer for streams
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(DASHSCOPE_API_URL, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      clearTimeout(timeoutId);
      const errorText = await response.text();
      throw new Error(
        `AI API stream request failed (${response.status}): ${errorText}`
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      clearTimeout(timeoutId);
      throw new Error("Response body is not readable for streaming");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Reset timeout on each chunk received
        clearTimeout(timeoutId);

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") return;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch {
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(`AI stream timed out after ${timeoutMs / 1000}s`);
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
      reader.releaseLock();
    }
  }

  async generateImage(params: ImageGenerationParams): Promise<string> {
    const model = params.model || IMAGE_MODEL;
    const size = params.size || "768*1024"; // Portrait for book covers
    const n = params.n || 1;

    // Step 1: Submit image generation task
    const submitBody = {
      model,
      input: {
        prompt: params.prompt,
      },
      parameters: {
        size,
        n,
      },
    };

    const submitResponse = await fetch(DASHSCOPE_IMAGE_API_URL, {
      method: "POST",
      headers: {
        ...this.buildHeaders(),
        "X-DashScope-Async": "enable",
      },
      body: JSON.stringify(submitBody),
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error(`[QwenClient] Image generation submit failed ${submitResponse.status}: ${errorText.slice(0, 500)}`);
      throw new Error(
        `Image generation failed (${submitResponse.status}): ${errorText.slice(0, 300)}`
      );
    }

    const submitData = await submitResponse.json();
    const taskId = submitData?.output?.task_id;
    if (!taskId) {
      console.error("[QwenClient] No task_id returned:", JSON.stringify(submitData).slice(0, 500));
      throw new Error("Image generation: no task_id returned");
    }

    // Step 2: Poll for task completion
    const pollUrl = `${DASHSCOPE_TASK_API_URL}/${taskId}`;
    const timeoutMs = params.timeoutMs || IMAGE_MAX_POLLS * IMAGE_POLL_INTERVAL_MS;
    const startTime = Date.now();

    for (let i = 0; i < IMAGE_MAX_POLLS; i++) {
      if (Date.now() - startTime > timeoutMs) {
        throw new Error(`Image generation timed out after ${timeoutMs / 1000}s`);
      }

      await new Promise((resolve) => setTimeout(resolve, IMAGE_POLL_INTERVAL_MS));

      const pollResponse = await fetch(pollUrl, {
        method: "GET",
        headers: this.buildHeaders(),
      });

      if (!pollResponse.ok) {
        const errorText = await pollResponse.text();
        console.error(`[QwenClient] Image poll failed ${pollResponse.status}: ${errorText.slice(0, 500)}`);
        throw new Error(
          `Image poll failed (${pollResponse.status}): ${errorText.slice(0, 300)}`
        );
      }

      const pollData = await pollResponse.json();
      const status = pollData?.output?.task_status;

      if (status === "SUCCEEDED") {
        const results = pollData?.output?.results;
        if (results && results.length > 0) {
          const imageUrl = results[0]?.url;
          if (imageUrl) {
            return imageUrl;
          }
        }
        throw new Error("Image generation succeeded but no URL returned");
      } else if (status === "FAILED") {
        const message = pollData?.output?.message || "Unknown error";
        throw new Error(`Image generation failed: ${message}`);
      }
      // status === "PENDING" or "RUNNING": continue polling
    }

    throw new Error(`Image generation timed out after ${IMAGE_MAX_POLLS} polls`);
  }
}
