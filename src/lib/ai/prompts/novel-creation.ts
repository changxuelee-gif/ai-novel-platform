const SUFFIX = "重要：请只输出纯JSON对象，不要输出任何解释、说明、问候语或markdown代码块标记（如```json）。字段名必须使用英文字段名。";

function getLocaleInstruction(locale?: string): string {
  switch (locale) {
    case "en":
    case "en-US":
    case "English":
      return "Please output all content in English.";
    case "ja":
    case "ja-JP":
    case "日本語":
      return "すべての内容を日本語で出力してください。";
    case "ko":
    case "ko-KR":
    case "한국어":
      return "모든 내용을 한국어로 출력하세요.";
    case "zh-TW":
    case "繁體中文":
      return "請使用繁體中文輸出所有內容。";
    case "zh-CN":
    case "zh":
    case "中文":
    default:
      return "请使用简体中文输出所有内容。";
  }
}

export interface NovelMetadata {
  title: string;
  category: string;
  tags: string[];
  summary: string;
}

export interface NovelCharacter {
  name: string;
  gender: string;
  age: number;
  personality: string;
  background: string;
  goal: string;
  appearance: string;
}

export interface OutlineChapter {
  order: number;
  title: string;
  summary: string;
}

export interface ChapterSummary {
  summary: string;
  characters: string[];
  keyEvents: string[];
}

export function buildMetadataPrompt(
  concept: string,
  locale?: string
): { systemPrompt: string; prompt: string } {
  const localeInst = getLocaleInstruction(locale);
  const systemPrompt = `你是一位资深小说策划编辑，擅长从用户的一句话构想中提炼出精彩的小说设定。${localeInst}
你必须严格返回JSON格式，包含以下字段：
- title: 小说名，2-8个字，简洁有力吸引人
- category: 小说分类，必须从以下选项中选择一个：玄幻、都市、仙侠、科幻、竞技、历史、悬疑、言情
- tags: 标签数组，5-8个标签，每个标签2-4个字，精准概括小说特色
- summary: 小说简介，200-300字，包含故事核心设定、主角身份、核心冲突和看点

防幻觉要求：
1. 严格基于用户提供的构想生成内容，不得引入构想之外的元素
2. 分类和标签必须与构想主题相符
3. 简介中的设定必须能从用户构想中推导出来

${SUFFIX}`;

  const prompt = `用户的小说构想：${concept}

请根据以上构想，生成符合要求的小说元数据JSON。`;

  return { systemPrompt, prompt };
}

export function buildWorldviewPrompt(
  concept: string,
  metadata: NovelMetadata,
  locale?: string
): { systemPrompt: string; prompt: string } {
  const localeInst = getLocaleInstruction(locale);
  const systemPrompt = `你是一位专业的小说世界观架构师。${localeInst}
基于已有的小说构想和元数据，构建一个完整、自洽、引人入胜的世界观设定。
你必须严格返回JSON格式，包含以下字段：
- worldview: 世界观描述，500字左右

世界观描述必须包含以下四个维度：
1. 时代背景：故事发生的时代、文明发展程度
2. 地理环境：主要场景所在的地理环境、重要地点
3. 力量体系/社会规则：该世界的特殊力量体系或独特社会规则
4. 核心矛盾：驱动故事发展的根本矛盾

一致性约束：
1. 角色名、地名等专有名词一旦确定必须保持一致
2. 世界观设定必须与小说分类(${metadata.category})和标签相符
3. 世界观必须与用户构想和元数据保持一致，不得引入无关设定
4. 力量体系/社会规则要有明确边界，不能随意扩展

防幻觉要求：严格基于已有的构想和元数据进行扩展，不引入构想外的核心设定。

${SUFFIX}`;

  const prompt = `用户原始构想：${concept}

小说元数据：
标题：${metadata.title}
分类：${metadata.category}
标签：${metadata.tags.join("、")}
简介：${metadata.summary}

请基于以上信息，生成完整的世界观设定JSON。`;

  return { systemPrompt, prompt };
}

export function buildCharacterPrompt(
  concept: string,
  metadata: NovelMetadata,
  worldview: string,
  locale?: string
): { systemPrompt: string; prompt: string } {
  const localeInst = getLocaleInstruction(locale);
  const systemPrompt = `你是一位资深小说人物设计师。${localeInst}
基于已有的小说构想、元数据和世界观，设计一个立体丰满的主角形象。
你必须严格返回JSON格式，包含以下字段：
- name: 主角姓名，符合世界观时代背景
- gender: 性别（男/女/其他）
- age: 年龄，数字
- personality: 性格，3-5个关键词描述（如：坚韧、隐忍、机智、热血、冷静）
- background: 背景故事，200字左右，交代身世、成长经历、转折事件
- goal: 目标动机，主角在故事中的核心追求和行动驱动力
- appearance: 外貌描述，突出辨识度的特征

防幻觉要求：
1. 主角设定必须与世界观设定一致，符合该世界的时代背景和社会规则
2. 主角的性格和背景必须能支撑核心矛盾的发展
3. 名字风格要符合分类设定（如玄幻名要有古风，都市名要现代）
4. 不得引入与世界观矛盾的设定或能力

${SUFFIX}`;

  const prompt = `用户原始构想：${concept}

小说元数据：
标题：${metadata.title}
分类：${metadata.category}
标签：${metadata.tags.join("、")}
简介：${metadata.summary}

世界观设定：
${worldview}

请基于以上信息，设计主角设定JSON。`;

  return { systemPrompt, prompt };
}

export function buildOutlinePrompt(
  concept: string,
  metadata: NovelMetadata,
  worldview: string,
  character: NovelCharacter,
  chapterCount: number = 10,
  locale?: string
): { systemPrompt: string; prompt: string } {
  const localeInst = getLocaleInstruction(locale);
  const systemPrompt = `你是一位专业小说大纲策划师。${localeInst}
基于已有的小说设定，为小说规划一份完整的章节大纲。
你必须严格返回JSON格式，包含以下字段：
- chapters: 章节数组，每个章节包含：
  - order: 章节序号，从1开始
  - title: 章节标题，简洁吸引人，10字以内
  - summary: 章节摘要，100-200字，概述本章主要情节和转折

大纲结构要求：
1. 共${chapterCount}章
2. 第一章为故事开端，交代背景、引入主角、设置悬念
3. 中间章节为发展和高潮，情节层层递进，矛盾不断升级
4. 最后一章要有收尾或留下强烈悬念，为后续发展埋下伏笔
5. 整体要有完整的起承转合结构

防幻觉要求：
1. 大纲必须严格基于已有的世界观设定和主角设定
2. 主角名字必须统一为"${character.name}"，性格与设定一致
3. 力量体系、社会规则必须与世界观一致，不得随意扩展
4. 情节发展要符合逻辑，人物行为要符合性格设定
5. 不得引入设定外的重要新角色和新世界观元素

${SUFFIX}`;

  const prompt = `用户原始构想：${concept}

小说元数据：
标题：${metadata.title}
分类：${metadata.category}
标签：${metadata.tags.join("、")}
简介：${metadata.summary}

世界观设定：
${worldview}

主角设定：
姓名：${character.name}
性别：${character.gender}
年龄：${character.age}
性格：${character.personality}
背景：${character.background}
目标：${character.goal}
外貌：${character.appearance}

请规划${chapterCount}章的完整章节大纲JSON。`;

  return { systemPrompt, prompt };
}

export function buildChapterPrompt(
  metadata: NovelMetadata,
  worldview: string,
  character: NovelCharacter,
  outlineChapters: Array<{ title: string; summary: string }>,
  previousChaptersSummary: string,
  chapterIndex: number,
  locale?: string
): { systemPrompt: string; prompt: string } {
  const localeInst = getLocaleInstruction(locale);
  const currentChapter = outlineChapters[chapterIndex];
  const systemPrompt = `你是一位才华横溢的小说作家，擅长创作引人入胜的小说章节内容。${localeInst}

写作要求（必须严格遵守）：
1. 严格按照当前章节的大纲标题和摘要撰写，不得偏离大纲内容
2. 主角名字必须全程使用"${character.name}"，性格特征必须与设定一致：${character.personality}
3. 使用小说叙事体，包含生动的对话、细腻的环境描写、精彩的动作描写和心理活动
4. 不引入设定外的新角色和新世界观元素，除非大纲中明确提及
5. 本章字数要求：2000-3000字，内容充实，节奏得当
6. 章节结尾必须有钩子或转折，制造悬念吸引读者继续阅读
7. 对话要符合人物身份和性格，描写要符合世界观设定
8. 叙事视角以第三人称为主，可适当穿插主角视角的心理描写

重要：返回纯文本小说内容，不要返回JSON格式，不要加markdown标记，直接输出正文。

${SUFFIX}`;

  const prevSummarySection = previousChaptersSummary
    ? `前情提要（前面章节的摘要，确保情节连贯）：
${previousChaptersSummary}

`
    : "";

  const prompt = `小说信息：
标题：${metadata.title}
分类：${metadata.category}

世界观设定：
${worldview}

主角设定：
姓名：${character.name}
性别：${character.gender}
性格：${character.personality}
背景：${character.background}
目标：${character.goal}
外貌：${character.appearance}

${prevSummarySection}本章是第${chapterIndex + 1}章，章节大纲如下：
标题：${currentChapter.title}
摘要：${currentChapter.summary}

请根据以上所有信息，撰写本章节的完整正文内容。`;

  return { systemPrompt, prompt };
}

export function buildChapterSummaryPrompt(
  chapterContent: string
): { systemPrompt: string; prompt: string } {
  const systemPrompt = `你是一位专业的小说编辑，擅长提炼章节摘要和追踪关键情节。
请阅读给定的小说章节内容，生成精炼的摘要和关键信息。
你必须严格返回JSON格式，包含以下字段：
- summary: 章节摘要，50-100字，精炼概括本章主要情节
- characters: 本章出现的角色名字数组
- keyEvents: 本章的关键事件数组（每个事件简短描述），用于追踪伏笔和情节线索

要求：
1. 摘要要准确概括本章核心内容，不遗漏重要转折
2. 角色名要准确，只列出本章实际出场的角色
3. 关键事件要标注伏笔、冲突、转折、重要信息揭露等

${SUFFIX}`;

  const prompt = `小说章节内容：
${chapterContent}

请提炼本章的摘要、出场角色和关键事件JSON。`;

  return { systemPrompt, prompt };
}

export function buildQuickChapterPrompt(
  concept: string,
  metadata: NovelMetadata,
  chapters: Array<{ title: string; summary: string }>,
  chapterIndex: number,
  previousChaptersSummary?: string,
  locale?: string
): { systemPrompt: string; prompt: string } {
  const localeInst = getLocaleInstruction(locale);
  const currentChapter = chapters[chapterIndex];
  const systemPrompt = `你是一位才华横溢的小说作家，擅长基于简要设定快速创作精彩的小说章节。${localeInst}

写作要求（必须严格遵守）：
1. 严格按照当前章节的大纲标题和摘要撰写，不得偏离大纲
2. 根据小说标题、分类、简介推导合理的世界观和主角形象，保持一致性
3. 使用小说叙事体，包含生动的对话、环境描写、动作描写和心理活动
4. 主角名字和性格一旦在写作中确定，后续必须保持一致
5. 不引入与大纲无关的重要新设定
6. 本章字数要求：2000-3000字，内容充实，节奏得当
7. 章节结尾必须有钩子或转折，制造悬念吸引读者继续阅读

重要：返回纯文本小说内容，不要返回JSON格式，不要加markdown标记，直接输出正文。

${SUFFIX}`;

  const prevSummarySection = previousChaptersSummary
    ? `前情提要：
${previousChaptersSummary}

`
    : "";

  const prompt = `用户原始构想：${concept}

小说元数据：
标题：${metadata.title}
分类：${metadata.category}
标签：${metadata.tags.join("、")}
简介：${metadata.summary}

${prevSummarySection}本章是第${chapterIndex + 1}章，章节大纲如下：
标题：${currentChapter.title}
摘要：${currentChapter.summary}

请根据以上信息，撰写本章节的完整正文内容。`;

  return { systemPrompt, prompt };
}
