import { getAIClient } from "./index";

/**
 * 根据小说元数据生成高质量的英文文生图prompt
 * 使用qwen-plus模型将中文信息转换为适合文生图的英文描述
 */
export async function buildCoverImagePrompt(options: {
  title: string;
  summary: string;
  category?: string;
  tags?: string[];
}): Promise<string> {
  const { title, summary, category, tags } = options;

  const systemPrompt = `You are an expert book cover designer and prompt engineer. Your task is to create detailed, evocative English prompts for AI image generation based on novel metadata.

Requirements:
1. Output ONLY the prompt text, no explanations or JSON
2. Write in English only
3. Include: visual style, mood, color palette, key visual elements, composition
4. Make it suitable for a book cover (portrait orientation, dramatic, eye-catching)
5. Keep it under 150 words
6. Focus on visual elements that can be rendered, not abstract concepts

Example output:
"A dramatic fantasy book cover featuring a lone warrior standing atop a misty mountain peak, sword raised toward a stormy sky with lightning. Dark purple and gold color palette, cinematic lighting, epic atmosphere. Digital painting style with high detail, portrait composition."`;

  const userPrompt = `Create a book cover image generation prompt for this novel:

Title: ${title}
Category: ${category || "General"}
Tags: ${(tags || []).join(", ")}
Summary: ${summary}

Generate a detailed English prompt for AI image generation that captures the essence and mood of this novel.`;

  const client = getAIClient();
  const prompt = await client.complete({
    prompt: userPrompt,
    systemPrompt,
    model: "qwen-plus",
    maxTokens: 512,
    temperature: 0.8,
  });

  return prompt.trim();
}
