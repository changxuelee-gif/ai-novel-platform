import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "@/server/trpc";
import { getAIClient } from "@/lib/ai/client";
import { checkQuota, recordUsage } from "@/lib/ai/quota";
import {
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
  title: z.string().min(1).max(30),
  category: z.string().min(1),
  tags: z.array(z.string().min(1).max(10)).min(3).max(15),
  summary: z.string().min(50).max(800),
});

const worldviewSchema = z.object({
  worldview: z.string().min(50).max(3000),
});

const characterSchema = z.object({
  name: z.string().min(1).max(20),
  gender: z.string().min(1).max(10),
  age: z.coerce.number().int().min(5).max(1000),
  personality: z.string().min(1).max(300),
  background: z.string().min(20).max(2000),
  goal: z.string().min(5).max(1000),
  appearance: z.string().min(5).max(1000),
});

const outlineChapterSchema = z.object({
  order: z.coerce.number().int().min(1),
  title: z.string().min(1).max(50),
  summary: z.string().min(20).max(1000),
});

const outlineSchema = z.object({
  chapters: z.array(outlineChapterSchema).min(3).max(20),
});

/**
 * Extract a JSON object from AI response text.
 * Handles: pure JSON, markdown code fences, JSON embedded in explanatory text.
 */
function extractJSON(text: string): unknown | null {
  const trimmed = text.trim();

  // Try to find JSON inside markdown code blocks first (```json ... ``` or ``` ... ```)
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (codeBlockMatch) {
    const inside = codeBlockMatch[1].trim();
    try {
      return JSON.parse(inside);
    } catch {
      // Fall through to other methods
    }
  }

  // Try to parse the whole thing as JSON directly
  try {
    return JSON.parse(trimmed);
  } catch {
    // Fall through
  }

  // Try to find the outermost JSON object by brace matching
  // Find the first { and last } to extract a JSON-like block
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = trimmed.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      // Try to fix common issues: trailing commas, unquoted keys
      try {
        // Remove trailing commas before } or ]
        const fixed = candidate.replace(/,(\s*[}\]])/g, "$1");
        return JSON.parse(fixed);
      } catch {
        // Give up
      }
    }
  }

  // Try to find the outermost JSON array
  const firstBracket = trimmed.indexOf("[");
  const lastBracket = trimmed.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    const candidate = trimmed.slice(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      // ignore
    }
  }

  return null;
}

/**
 * Normalize AI response to handle common format issues:
 * - Chinese field names → English field names
 * - Wrapped objects ({"character": {...}}, {"主角": {...}}, [ {...} ])
 * - String numbers → actual numbers
 */
function normalizeAIResponse(data: unknown, expectedShape: "metadata" | "worldview" | "character" | "outline", depth = 0): unknown {
  // Prevent infinite recursion
  if (depth > 5) return data;

  // If it's an array with one element, unwrap
  if (Array.isArray(data) && data.length === 1) {
    data = data[0];
  }

  // For outline shape: if data is an array (of chapters), wrap it
  if (expectedShape === "outline" && Array.isArray(data) && data.length > 1) {
    return { chapters: data.map((item, idx) => {
      if (typeof item === "object" && item !== null) {
        return normalizeAIResponse(item, "outline", depth + 1);
      }
      return item;
    }) };
  }

  if (typeof data !== "object" || data === null) return data;

  const obj = data as Record<string, unknown>;

  // Field name mappings: Chinese → English for each shape
  const fieldMaps: Record<string, Record<string, string>> = {
    metadata: {
      标题: "title", 书名: "title", 名称: "title", title: "title",
      分类: "category", 类型: "category", 题材: "category", category: "category", genre: "category",
      标签: "tags", 关键词: "tags", tags: "tags",
      简介: "summary", 介绍: "summary", 描述: "summary", 概要: "summary", summary: "summary", description: "summary",
    },
    worldview: {
      世界观: "worldview", 设定: "worldview", 世界观设定: "worldview", worldview: "worldview", setting: "worldview",
    },
    character: {
      姓名: "name", 名字: "name", 名称: "name", 主角名: "name", name: "name",
      性别: "gender", gender: "gender", sex: "gender",
      年龄: "age", 岁数: "age", age: "age",
      性格: "personality", 性格特点: "personality", 性格特征: "personality", personality: "personality", traits: "personality",
      背景: "background", 背景故事: "background", 身世: "background", 经历: "background", background: "background", story: "background",
      目标: "goal", 动机: "goal", 追求: "goal", 目标追求: "goal", goal: "goal", motivation: "goal", objective: "goal",
      外貌: "appearance", 形象: "appearance", 外貌描写: "appearance", 长相: "appearance", appearance: "appearance", looks: "appearance",
    },
    outline: {
      章节: "chapters", 章节列表: "chapters", 大纲: "chapters", 目录: "chapters", chapters: "chapters", outline: "chapters",
      序号: "order", 顺序: "order", 章节号: "order", 编号: "order", order: "order", number: "order", index: "order",
      章节标题: "title", 标题: "title", 章名: "title", title: "title",
      摘要: "summary", 概要: "summary", 内容: "summary", 梗概: "summary", summary: "summary", content: "summary",
    },
  };

  // Try to unwrap common wrapper objects
  const wrapperKeys: Record<string, string[]> = {
    metadata: ["metadata", "novel", "小说", "元数据", "小说信息", "data", "result"],
    worldview: ["worldview", "setting", "世界观", "设定", "世界观设定", "data", "result"],
    character: ["character", "protagonist", "主角", "人物", "人物设定", "主角设定", "角色", "data", "result"],
    outline: ["outline", "chapters", "大纲", "章节大纲", "目录", "章节列表", "data", "result"],
  };

  const wrappers = wrapperKeys[expectedShape];
  for (const key of wrappers) {
    if (obj[key] && typeof obj[key] === "object") {
      // Check if this wrapped object looks like the right shape (has at least 2 expected fields)
      const wrapped = obj[key] as Record<string, unknown>;
      const fieldMap = fieldMaps[expectedShape];
      const matchingFields = Object.keys(wrapped).filter(
        k => fieldMap[k.toLowerCase()] || fieldMap[k] || Object.values(fieldMap).includes(k)
      );
      if (matchingFields.length >= 2) {
        return normalizeAIResponse(wrapped, expectedShape, depth + 1);
      }
    }
  }

  // Map field names
  const fieldMap = fieldMaps[expectedShape];
  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    const mappedKey = fieldMap[key] || fieldMap[lowerKey] || key;

    // Recursively normalize nested objects for outline
    if (expectedShape === "outline" && mappedKey === "chapters" && Array.isArray(value)) {
      normalized[mappedKey] = value.map((item: unknown) => normalizeAIResponse(item, "outline", depth + 1));
    } else if (expectedShape === "outline" && typeof value === "object" && value !== null && !Array.isArray(value)) {
      // For nested chapter objects, normalize them
      normalized[mappedKey] = normalizeAIResponse(value, "outline", depth + 1);
    } else {
      normalized[mappedKey] = value;
    }
  }

  // Convert string numbers for numeric fields
  if (expectedShape === "character") {
    if (typeof normalized.age === "string") {
      const numMatch = (normalized.age as string).match(/\d+/);
      if (numMatch) normalized.age = parseInt(numMatch[0], 10);
    }
  }
  if (expectedShape === "outline") {
    if (Array.isArray(normalized.chapters)) {
      normalized.chapters = normalized.chapters.map((ch: Record<string, unknown>, idx: number) => {
        if (typeof ch.order === "string") {
          const numMatch = (ch.order as string).match(/\d+/);
          if (numMatch) ch.order = parseInt(numMatch[0], 10);
        }
        if (ch.order === undefined || ch.order === null) {
          ch.order = idx + 1;
        }
        return ch;
      });
    }
  }

  return normalized;
}

async function callAIWithJSON<T>(
  userId: string,
  action: string,
  systemPrompt: string,
  prompt: string,
  temperature: number,
  maxTokens: number,
  schema: z.ZodSchema<T>,
  expectedShape: "metadata" | "worldview" | "character" | "outline",
  retries: number = 2
): Promise<T> {
  const client = getAIClient();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await client.complete({
        systemPrompt: systemPrompt + "\n\n你必须只返回纯JSON对象，不要包含任何解释、说明、markdown代码块标记或其他文字。所有字段名必须使用英文。",
        prompt,
        temperature,
        maxTokens,
      });

      if (!result || typeof result !== "string") {
        if (attempt < retries) {
          console.warn(`[AI] Empty result on attempt ${attempt + 1}, retrying...`);
          continue;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI返回内容为空，请重试",
        });
      }

      // Robustly extract JSON from the AI response
      let parsed = extractJSON(result);

      if (parsed === null) {
        console.warn(`[AI] Failed to extract JSON on attempt ${attempt + 1}:`, result.slice(0, 300));
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

      // Normalize the response (handle Chinese field names, wrapped objects, string numbers)
      try {
        parsed = normalizeAIResponse(parsed, expectedShape);
      } catch (normError) {
        console.warn(`[AI] Normalization error on attempt ${attempt + 1}:`, normError instanceof Error ? normError.message : normError);
        // Continue with the un-normalized parsed data - let zod try to validate it
      }

      let validated: T;
      try {
        validated = schema.parse(parsed);
      } catch (validationError) {
        console.warn(`[AI] Schema validation failed on attempt ${attempt + 1}:`, validationError instanceof Error ? validationError.message : validationError);
        console.warn(`[AI] Raw response:`, result.slice(0, 500));
        console.warn(`[AI] Parsed data:`, JSON.stringify(parsed).slice(0, 500));
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
          message: "AI返回数据验证失败，请重试",
        });
      }

      const cleanedResult = JSON.stringify(parsed);
      const contentCheck = checkContentSafety(cleanedResult);
      if (!contentCheck.passed) {
        logAIAudit({
          userId,
          action,
          inputPreview: prompt,
          outputPreview: cleanedResult,
          blocked: true,
        });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: contentCheck.reason || "生成内容不符合规范",
        });
      }

      await recordUsage(userId, action, prompt.length, cleanedResult.length);
      logAIAudit({
        userId,
        action,
        inputPreview: prompt,
        outputPreview: cleanedResult,
        blocked: false,
      });

      return validated;
    } catch (e) {
      if (e instanceof TRPCError) throw e;
      console.error(`[AI] ${action} error (attempt ${attempt + 1}/${retries + 1}):`, e instanceof Error ? e.message : e);
      if (attempt < retries) continue;
      const errorMessage = e instanceof Error ? e.message : "未知错误";
      // Map common error patterns to user-friendly messages
      if (errorMessage.includes("401") || errorMessage.includes("Unauthorized") || errorMessage.includes("API key")) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI服务认证失败，请联系管理员检查API配置",
        });
      }
      if (errorMessage.includes("429") || errorMessage.includes("rate limit") || errorMessage.includes("quota")) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "AI服务繁忙，请稍后重试",
        });
      }
      if (errorMessage.includes("timeout") || errorMessage.includes("network") || errorMessage.includes("fetch")) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI服务连接超时，请检查网络后重试",
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "AI生成失败，请重试",
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
        2048,
        metadataSchema,
        "metadata"
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
        worldviewSchema,
        "worldview"
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
        2048,
        characterSchema,
        "character"
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
          age: z.coerce.number(),
          personality: z.string(),
          background: z.string(),
          goal: z.string(),
          appearance: z.string(),
        }),
        chapterCount: z.coerce.number().min(3).max(20).default(10),
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
        outlineSchema,
        "outline"
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
    .output(
      z.object({
        metadata: metadataSchema,
        worldview: z.string().min(50),
        character: characterSchema,
        outline: z.array(outlineChapterSchema).min(3).max(20),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      try {
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
          2048,
          metadataSchema,
          "metadata"
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
        >(userId, "quickCreate_worldview", wvSys, wvPrompt, 0.7, 2048, worldviewSchema, "worldview");

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
          2048,
          characterSchema,
          "character"
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
          outlineSchema,
          "outline"
        );

        return {
          metadata,
          worldview: worldviewResult.worldview,
          character,
          outline: outline.chapters,
        };
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        console.error("[quickCreateNovel] Unexpected error:", e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: e instanceof Error ? e.message : "生成过程中发生未知错误，请重试",
        });
      }
    }),
});
