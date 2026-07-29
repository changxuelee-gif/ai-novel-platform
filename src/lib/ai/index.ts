export type { AIGenerationOptions, AICompleteParams, AIClient } from "./types";
export { getAIClient } from "./client";
export {
  buildContinuePrompt,
  buildInspirePrompt,
  buildRewritePrompt,
  buildDialoguePrompt,
  buildOutlinePrompt,
  buildRandomCharacterPrompt,
  buildRandomStylePrompt,
} from "./prompts";
export {
  buildMetadataPrompt,
  buildWorldviewPrompt,
  buildCharacterPrompt,
  buildOutlinePrompt as buildNovelOutlinePrompt,
  buildChapterPrompt,
  buildChapterSummaryPrompt,
  buildQuickChapterPrompt,
} from "./prompts/novel-creation";
export type {
  NovelMetadata,
  NovelCharacter,
  OutlineChapter,
  ChapterSummary,
} from "./prompts/novel-creation";
