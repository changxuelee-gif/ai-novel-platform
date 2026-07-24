import type { AIClient, AICompleteParams } from "./types";

const DASHSCOPE_API_URL =
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const DEFAULT_MODEL = "qwen3-plus";

export class QwenClient implements AIClient {
  private apiKey: string;

  constructor() {
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Missing DASHSCOPE_API_KEY environment variable. Please set it in your .env file."
      );
    }
    this.apiKey = apiKey;
  }

  private buildRequestBody(params: AICompleteParams, stream = false) {
    const messages = [
      { role: "user", content: params.prompt },
    ];

    if (params.context) {
      messages.unshift({ role: "system", content: params.context });
    }

    return {
      model: params.model || DEFAULT_MODEL,
      messages,
      temperature: params.temperature ?? 0.7,
      max_tokens: params.maxTokens ?? 2048,
      stream,
    };
  }

  private buildHeaders() {
    return {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async complete(params: AICompleteParams): Promise<string> {
    const body = this.buildRequestBody(params);

    const response = await fetch(DASHSCOPE_API_URL, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Qwen API request failed (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async *completeStream(
    params: AICompleteParams
  ): AsyncIterable<string> {
    const body = this.buildRequestBody(params, true);

    const response = await fetch(DASHSCOPE_API_URL, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Qwen API stream request failed (${response.status}): ${errorText}`
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable for streaming");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last potentially incomplete line in the buffer
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
            // Skip malformed JSON lines
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
