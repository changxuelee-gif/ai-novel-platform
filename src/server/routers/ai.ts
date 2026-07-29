import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "@/server/trpc";
import {
  getAIClient,
  buildContinuePrompt,
  buildInspirePrompt,
  buildRewritePrompt,
  buildDialoguePrompt,
  buildOutlinePrompt,
  buildRandomCharacterPrompt,
  buildRandomStylePrompt,
} from "@/lib/ai";
import { checkQuota, recordUsage } from "@/lib/ai/quota";
import { checkContentSafety, logAIAudit } from "@/lib/ai/safety";

export const aiRouter = router({
  continue: protectedProcedure
    .input(
      z.object({
        context: z.string().min(1),
        character: z.string().optional(),
        style: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const quota = await checkQuota(userId);
      if (!quota.allowed) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "今日AI使用额度已用完，请明天再试或升级套餐",
        });
      }

      const prompt = buildContinuePrompt(input.context, input.character, input.style);
      const client = getAIClient();
      const result = await client.complete({ prompt, useFastModel: true });

      const safety = checkContentSafety(result);
      if (!safety.passed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "生成内容不符合规范",
        });
      }

      // Fire-and-forget usage tracking
      recordUsage(userId, "continue", prompt.length, result.length).catch(() => {});
      logAIAudit({
        userId,
        action: "continue",
        inputPreview: input.context,
        outputPreview: result,
        blocked: false,
      });

      return { content: result };
    }),

  inspire: protectedProcedure
    .input(
      z.object({
        chapterContent: z.string().min(1),
        setting: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const quota = await checkQuota(userId);
      if (!quota.allowed) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "今日AI使用额度已用完，请明天再试或升级套餐",
        });
      }

      const prompt = buildInspirePrompt(input.chapterContent, input.setting);
      const client = getAIClient();
      const result = await client.complete({ prompt, useFastModel: true });

      const safety = checkContentSafety(result);
      if (!safety.passed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "生成内容不符合规范",
        });
      }

      recordUsage(userId, "inspire", prompt.length, result.length).catch(() => {});
      logAIAudit({
        userId,
        action: "inspire",
        inputPreview: input.chapterContent,
        outputPreview: result,
        blocked: false,
      });

      return { suggestions: result };
    }),

  rewrite: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        mode: z.enum(["vivid", "concise", "academic", "colloquial"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const quota = await checkQuota(userId);
      if (!quota.allowed) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "今日AI使用额度已用完，请明天再试或升级套餐",
        });
      }

      const modeMap: Record<string, string> = {
        vivid: "生动",
        concise: "简洁",
        academic: "学术",
        colloquial: "口语",
      };
      const prompt = buildRewritePrompt(input.text, modeMap[input.mode]);
      const client = getAIClient();
      const result = await client.complete({ prompt, useFastModel: true });

      const safety = checkContentSafety(result);
      if (!safety.passed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "生成内容不符合规范",
        });
      }

      recordUsage(userId, "rewrite", prompt.length, result.length).catch(() => {});
      logAIAudit({
        userId,
        action: "rewrite",
        inputPreview: input.text,
        outputPreview: result,
        blocked: false,
      });

      return { content: result };
    }),

  dialogue: protectedProcedure
    .input(
      z.object({
        characters: z.array(
          z.object({
            name: z.string().min(1),
            personality: z.string().min(1),
          })
        ),
        situation: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const quota = await checkQuota(userId);
      if (!quota.allowed) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "今日AI使用额度已用完，请明天再试或升级套餐",
        });
      }

      const prompt = buildDialoguePrompt(input.characters, input.situation);
      const client = getAIClient();
      const result = await client.complete({ prompt, useFastModel: true });

      const safety = checkContentSafety(result);
      if (!safety.passed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "生成内容不符合规范",
        });
      }

      recordUsage(userId, "dialogue", prompt.length, result.length).catch(() => {});
      logAIAudit({
        userId,
        action: "dialogue",
        inputPreview: input.situation,
        outputPreview: result,
        blocked: false,
      });

      return { content: result };
    }),

  outline: protectedProcedure
    .input(
      z.object({
        worldView: z.string().min(1),
        protagonist: z.string().min(1),
        conflict: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const quota = await checkQuota(userId);
      if (!quota.allowed) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "今日AI使用额度已用完，请明天再试或升级套餐",
        });
      }

      const prompt = buildOutlinePrompt(input.worldView, input.protagonist, input.conflict);
      const client = getAIClient();
      const result = await client.complete({ prompt, useFastModel: true });

      const safety = checkContentSafety(result);
      if (!safety.passed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "生成内容不符合规范",
        });
      }

      recordUsage(userId, "outline", prompt.length, result.length).catch(() => {});
      logAIAudit({
        userId,
        action: "outline",
        inputPreview: input.worldView,
        outputPreview: result,
        blocked: false,
      });

      return { content: result };
    }),

  randomCharacter: protectedProcedure
    .input(
      z.object({
        tags: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const quota = await checkQuota(userId);
      if (!quota.allowed) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "今日AI使用额度已用完，请明天再试或升级套餐",
        });
      }

      const prompt = buildRandomCharacterPrompt(input.tags);
      const client = getAIClient();
      const result = await client.complete({ prompt, useFastModel: true });

      const safety = checkContentSafety(result);
      if (!safety.passed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "生成内容不符合规范",
        });
      }

      recordUsage(userId, "randomCharacter", prompt.length, result.length).catch(() => {});
      logAIAudit({
        userId,
        action: "randomCharacter",
        inputPreview: input.tags,
        outputPreview: result,
        blocked: false,
      });

      return { content: result };
    }),

  randomStyle: protectedProcedure
    .input(
      z.object({
        tags: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const quota = await checkQuota(userId);
      if (!quota.allowed) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "今日AI使用额度已用完，请明天再试或升级套餐",
        });
      }

      const prompt = buildRandomStylePrompt(input.tags);
      const client = getAIClient();
      const result = await client.complete({ prompt, useFastModel: true });

      const safety = checkContentSafety(result);
      if (!safety.passed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "生成内容不符合规范",
        });
      }

      recordUsage(userId, "randomStyle", prompt.length, result.length).catch(() => {});
      logAIAudit({
        userId,
        action: "randomStyle",
        inputPreview: input.tags,
        outputPreview: result,
        blocked: false,
      });

      return { content: result };
    }),
});
