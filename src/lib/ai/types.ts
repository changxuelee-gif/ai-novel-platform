export interface AIGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AICompleteParams {
  prompt: string;
  context?: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface AIClient {
  complete(params: AICompleteParams): Promise<string>;
  completeStream(params: AICompleteParams): AsyncIterable<string>;
}
