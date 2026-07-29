import type { AIClient, AICompleteParams } from "./types";

const DASHSCOPE_API_URL =
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const DEFAULT_MODEL = process.env.AI_MODEL || "qwen-plus";
const DEFAULT_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS) || 25000; // 25 seconds (matches Netlify Pro 26s limit; free tier is 10s)

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

    const body: Record<string, unknown> = {
      model: params.model || DEFAULT_MODEL,
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
}
