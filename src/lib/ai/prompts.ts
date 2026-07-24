/**
 * 构建续写 Prompt
 */
export function buildContinuePrompt(
  context: string,
  character?: string,
  style?: string
): string {
  let prompt = `你是一位专业小说作家。请根据以下前文内容，续写下一段。保持角色一致性和文风统一。\n\n前文：\n${context}`;

  if (character) {
    prompt += `\n\n角色设定：${character}`;
  }
  if (style) {
    prompt += `\n\n文风要求：${style}`;
  }

  return prompt;
}

/**
 * 构建灵感激发 Prompt
 */
export function buildInspirePrompt(
  chapterContent: string,
  setting?: string
): string {
  let prompt = `基于当前情节，提供3个不同的故事发展方向，每个方向100字左右。\n\n当前内容：\n${chapterContent}`;

  if (setting) {
    prompt += `\n\n背景设定：${setting}`;
  }

  return prompt;
}

/**
 * 构建改写 Prompt
 * @param mode 改写模式：生动/简洁/学术/口语
 */
export function buildRewritePrompt(text: string, mode: string): string {
  return `请将以下文本改写得更加${mode}，保持原意：\n\n${text}`;
}

/**
 * 构建对话生成 Prompt
 */
export function buildDialoguePrompt(
  characters: Array<{ name: string; personality: string }>,
  situation: string
): string {
  const characterDescriptions = characters
    .map((c) => `- ${c.name}：${c.personality}`)
    .join("\n");

  return `你是一位专业的小说对话作家。请根据以下角色设定和情境，生成一段自然流畅的对话。\n\n角色设定：\n${characterDescriptions}\n\n情境：${situation}\n\n请直接输出对话内容，格式为"角色名：对话内容"。`;
}

/**
 * 构建大纲生成 Prompt
 */
export function buildOutlinePrompt(
  worldView: string,
  protagonist: string,
  conflict: string
): string {
  return `基于以下设定，生成一份详细的故事大纲，包含15-20章，每章提供标题和200字摘要。\n\n世界观：${worldView}\n\n主角：${protagonist}\n\n核心冲突：${conflict}`;
}

/**
 * 构建随机角色生成 Prompt
 */
export function buildRandomCharacterPrompt(tags: string): string {
  return `请根据以下标签，生成一个完整的小说角色设定，包含姓名、年龄、外貌特征、性格特点、背景故事、特殊能力或技能、口头禅或习惯动作。\n\n标签：${tags}\n\n请用结构化的格式输出。`;
}

/**
 * 构建随机文风生成 Prompt
 */
export function buildRandomStylePrompt(tags: string): string {
  return `请根据以下标签，生成一种独特的小说文风描述，包含文风名称、语言特点、句式特征、叙事视角偏好、节奏特点，并提供一段100字左右的示例段落展示该文风。\n\n标签：${tags}\n\n请用结构化的格式输出。`;
}
