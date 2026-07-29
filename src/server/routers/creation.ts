import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "@/server/trpc";
import { getAIClient } from "@/lib/ai/client";
import { checkQuota, recordUsage } from "@/lib/ai/quota";
import {
  isValidJSON,
  checkContentSafety,
  logAIAudit,
} from "@/lib/ai/safety";
import {
  buildMetadataPrompt,
  buildWorldviewPrompt,
  buildCharacterPrompt,
  buildOutlinePrompt as buildNovelOutlinePrompt,
  type NovelMetadata,
  type NovelCharacter,
} from "@/lib/ai/prompts/novel-creation";
import { prisma } from "@/lib/prisma";

const metadataSchema = z.object({
  title: z.string().min(2).max(20),
  category: z.string(),
  tags: z.array(z.string()).min(5).max(10),
  summary: z.string().min(100).max(500),
});

const worldviewSchema = z.object({
  worldview: z.string().min(100).max(2000),
});

const characterSchema = z.object({
  name: z.string().min(1).max(10),
  gender: z.string().min(1).max(5),
  age: z.number().int().min(10).max(100),
  personality: z.string().min(2).max(100),
  background: z.string().min(50).max(1000),
  goal: z.string().min(10).max(500),
  appearance: z.string().min(20).max(500),
});

const outlineChapterSchema = z.object({
  order: z.number().int().min(1),
  title: z.string().min(1).max(30),
  summary: z.string().min(50).max(500),
});

const outlineSchema = z.object({
  chapters: z.array(outlineChapterSchema).min(3).max(20),
});

async function callAIWithJSON<T>(
  userId: string,
  action: string,
  systemPrompt: string,
  prompt: string,
  temperature: number,
  maxTokens: number,
  schema: z.ZodSchema<T>,
  retries: number = 1
): Promise<T> {
  const client = getAIClient();

  for (let attempt = 0; attempt <= retries; attempt++) {
    const result = await client.complete({
      systemPrompt,
      prompt,
      temperature,
      maxTokens,
      jsonMode: true,
    });

    if (!isValidJSON(result)) {
      if (attempt < retries) continue;
      logAIAudit({
        userId,
        action,
        inputPreview: prompt,
        outputPreview: result,
        blocked: false,
      });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "AI返回格式解析失败，请重试",
      });
    }

    try {
      const parsed = JSON.parse(result);
      const validated = schema.parse(parsed);

      const contentCheck = checkContentSafety(result);
      if (!contentCheck.passed) {
        logAIAudit({
          userId,
          action,
          inputPreview: prompt,
          outputPreview: result,
          blocked: true,
        });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: contentCheck.reason || "生成内容不符合规范",
        });
      }

      await recordUsage(userId, action, prompt.length, result.length);
      logAIAudit({
        userId,
        action,
        inputPreview: prompt,
        outputPreview: result,
        blocked: false,
      });

      return validated;
    } catch (e) {
      if (e instanceof TRPCError) throw e;
      if (attempt < retries) continue;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "AI返回数据验证失败，请重试",
      });
    }
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "AI生成失败，请重试",
  });
}

export const creationRouter = router({
  generateMetadata: protectedProcedure
    .input(
      z.object({
        concept: z.string().min(5).max(500),
        locale: z.string().optional(),
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

      const { systemPrompt, prompt } = buildMetadataPrompt(
        input.concept,
        input.locale
      );

      return callAIWithJSON<z.infer<typeof metadataSchema>>(
        userId,
        "generateMetadata",
        systemPrompt,
        prompt,
        0.3,
        1024,
        metadataSchema
      );
    }),

  generateWorldview: protectedProcedure
    .input(
      z.object({
        concept: z.string(),
        title: z.string(),
        category: z.string(),
        tags: z.array(z.string()),
        summary: z.string(),
        locale: z.string().optional(),
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

      const metadata: NovelMetadata = {
        title: input.title,
        category: input.category,
        tags: input.tags,
        summary: input.summary,
      };

      const { systemPrompt, prompt } = buildWorldviewPrompt(
        input.concept,
        metadata,
        input.locale
      );

      return callAIWithJSON<z.infer<typeof worldviewSchema>>(
        userId,
        "generateWorldview",
        systemPrompt,
        prompt,
        0.7,
        2048,
        worldviewSchema
      );
    }),

  generateCharacter: protectedProcedure
    .input(
      z.object({
        concept: z.string(),
        title: z.string(),
        category: z.string(),
        tags: z.array(z.string()),
        summary: z.string(),
        worldview: z.string(),
        locale: z.string().optional(),
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

      const metadata: NovelMetadata = {
        title: input.title,
        category: input.category,
        tags: input.tags,
        summary: input.summary,
      };

      const { systemPrompt, prompt } = buildCharacterPrompt(
        input.concept,
        metadata,
        input.worldview,
        input.locale
      );

      return callAIWithJSON<z.infer<typeof characterSchema>>(
        userId,
        "generateCharacter",
        systemPrompt,
        prompt,
        0.7,
        1024,
        characterSchema
      );
    }),

  generateOutline: protectedProcedure
    .input(
      z.object({
        concept: z.string(),
        title: z.string(),
        category: z.string(),
        tags: z.array(z.string()),
        summary: z.string(),
        worldview: z.string(),
        character: z.object({
          name: z.string(),
          gender: z.string(),
          age: z.number(),
          personality: z.string(),
          background: z.string(),
          goal: z.string(),
          appearance: z.string(),
        }),
        chapterCount: z.number().min(3).max(20).default(10),
        locale: z.string().optional(),
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

      const metadata: NovelMetadata = {
        title: input.title,
        category: input.category,
        tags: input.tags,
        summary: input.summary,
      };

      const character: NovelCharacter = {
        name: input.character.name,
        gender: input.character.gender,
        age: input.character.age,
        personality: input.character.personality,
        background: input.character.background,
        goal: input.character.goal,
        appearance: input.character.appearance,
      };

      const { systemPrompt, prompt } = buildNovelOutlinePrompt(
        input.concept,
        metadata,
        input.worldview,
        character,
        input.chapterCount,
        input.locale
      );

      return callAIWithJSON<z.infer<typeof outlineSchema>>(
        userId,
        "generateOutline",
        systemPrompt,
        prompt,
        0.5,
        3000,
        outlineSchema
      );
    }),

  createNovelWithAI: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        summary: z.string().min(10).max(2000),
        categoryName: z.string().optional(),
        tags: z.array(z.string()),
        cover: z.string().optional(),
        chapters: z
          .array(
            z.object({
              title: z.string().min(1).max(100),
              content: z.string().min(100),
              order: z.number().int().min(1),
            })
          )
          .min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      for (const chapter of input.chapters) {
        if (chapter.content.length < 100) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `第${chapter.order}章内容不能少于100字`,
          });
        }
      }

      let categoryId: string | undefined;
      if (input.categoryName) {
        const categorySlug = input.categoryName
          .toLowerCase()
          .replace(/\s+/g, "-");
        const category = await prisma.category.upsert({
          where: { slug: categorySlug },
          update: {},
          create: {
            name: input.categoryName,
            slug: categorySlug,
          },
        });
        categoryId = category.id;
      }

      const tagRecords = await Promise.all(
        input.tags.map(async (tagName) => {
          const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-");
          return prisma.tag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: {
              name: tagName,
              slug: tagSlug,
            },
          });
        })
      );

      const novel = await prisma.novel.create({
        data: {
          title: input.title,
          summary: input.summary,
          cover: input.cover,
          tags: input.tags,
          aiAssisted: true,
          authorId: userId,
          categoryId,
        },
      });

      if (tagRecords.length > 0) {
        await prisma.novelTag.createMany({
          data: tagRecords.map((tag) => ({
            novelId: novel.id,
            tagId: tag.id,
          })),
          skipDuplicates: true,
        });
      }

      const chapters = await Promise.all(
        input.chapters.map((chapter) =>
          prisma.chapter.create({
            data: {
              title: chapter.title,
              content: chapter.content,
              order: chapter.order,
              novelId: novel.id,
            },
          })
        )
      );

      const firstChapter = chapters.sort((a, b) => a.order - b.order)[0];

      return {
        novelId: novel.id,
        firstChapterId: firstChapter.id,
      };
    }),

  quickCreateNovel: protectedProcedure
    .input(
      z.object({
        concept: z.string().min(5).max(500),
        locale: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const quotaCheck = async () => {
        const quota = await checkQuota(userId);
        if (!quota.allowed) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "今日AI使用额度已用完，请明天再试或升级套餐",
          });
        }
      };

      await quotaCheck();
      const { systemPrompt: metaSys, prompt: metaPrompt } = buildMetadataPrompt(
        input.concept,
        input.locale
      );
      const metadata = await callAIWithJSON<z.infer<typeof metadataSchema>>(
        userId,
        "quickCreate_metadata",
        metaSys,
        metaPrompt,
        0.3,
        1024,
        metadataSchema
      );

      await quotaCheck();
      const metadataObj: NovelMetadata = {
        title: metadata.title,
        category: metadata.category,
        tags: metadata.tags,
        summary: metadata.summary,
      };
      const { systemPrompt: wvSys, prompt: wvPrompt } = buildWorldviewPrompt(
        input.concept,
        metadataObj,
        input.locale
      );
      const worldviewResult = await callAIWithJSON<
        z.infer<typeof worldviewSchema>
      >(userId, "quickCreate_worldview", wvSys, wvPrompt, 0.7, 2048, worldviewSchema);

      await quotaCheck();
      const { systemPrompt: charSys, prompt: charPrompt } = buildCharacterPrompt(
        input.concept,
        metadataObj,
        worldviewResult.worldview,
        input.locale
      );
      const character = await callAIWithJSON<z.infer<typeof characterSchema>>(
        userId,
        "quickCreate_character",
        charSys,
        charPrompt,
        0.7,
        1024,
        characterSchema
      );

      await quotaCheck();
      const characterObj: NovelCharacter = {
        name: character.name,
        gender: character.gender,
        age: character.age,
        personality: character.personality,
        background: character.background,
        goal: character.goal,
        appearance: character.appearance,
      };
      const { systemPrompt: outlineSys, prompt: outlinePrompt } =
        buildNovelOutlinePrompt(
          input.concept,
          metadataObj,
          worldviewResult.worldview,
          characterObj,
          3,
          input.locale
        );
      const outline = await callAIWithJSON<z.infer<typeof outlineSchema>>(
        userId,
        "quickCreate_outline",
        outlineSys,
        outlinePrompt,
        0.5,
        3000,
        outlineSchema
      );

      return {
        metadata,
        worldview: worldviewResult.worldview,
        character,
        outline: outline.chapters,
      };
    }),
});
