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
