import type { AIClient } from "./types";
import { QwenClient } from "./qwen-client";

let clientInstance: AIClient | null = null;

export function getAIClient(): AIClient {
  if (!clientInstance) {
    const provider = process.env.AI_PROVIDER || "qwen";
    switch (provider) {
      case "qwen":
        clientInstance = new QwenClient();
        break;
      default:
        clientInstance = new QwenClient();
    }
  }
  return clientInstance;
}
