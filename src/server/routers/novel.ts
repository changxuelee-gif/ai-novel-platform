import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "@/server/trpc";
import { NovelStatus } from "@/generated/prisma/client";

export const novelRouter = router({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        categoryId: z.string().optional(),
        authorId: z.string().optional(),
        status: z.nativeEnum(NovelStatus).optional(),
        sortBy: z.string().default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, categoryId, authorId, status, sortBy, sortOrder } = input;

      const where: Record<string, unknown> = {};
      if (categoryId) where.categoryId = categoryId;
      if (authorId) where.authorId = authorId;
      if (status) where.status = status;

      const [novels, total] = await Promise.all([
        ctx.prisma.novel.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            author: { select: { id: true, name: true, avatar: true } },
            category: true,
          },
        }),
        ctx.prisma.novel.count({ where }),
      ]);

      return { novels, total, page, limit };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const novel = await ctx.prisma.novel.findUnique({
        where: { id: input.id },
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          category: true,
          novelTags: { include: { tag: true } },
          chapters: { select: { id: true, title: true, order: true } },
          _count: { select: { favorites: true, ratings: true } },
        },
      });

      if (!novel) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Novel not found" });
      }

      // Increment view count
      await ctx.prisma.novel.update({
        where: { id: input.id },
        data: { views: { increment: 1 } },
      });

      return novel;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        summary: z.string().optional(),
        cover: z.string().optional(),
        tags: z.array(z.string()).optional(),
        categoryId: z.string().optional(),
        aiAssisted: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { tags, ...novelData } = input;

      const novel = await ctx.prisma.novel.create({
        data: {
          ...novelData,
          authorId: ctx.session.user.id,
          ...(tags && tags.length > 0
            ? {
                novelTags: {
                  create: await Promise.all(
                    tags.map(async (tagName) => {
                      const tag = await ctx.prisma.tag.upsert({
                        where: { name: tagName },
                        update: {},
                        create: { name: tagName, slug: tagName.toLowerCase().replace(/\s+/g, "-") },
                      });
                      return { tagId: tag.id };
                    })
                  ),
                },
              }
            : {}),
        },
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          novelTags: { include: { tag: true } },
        },
      });

      return novel;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        summary: z.string().optional(),
        cover: z.string().optional(),
        status: z.nativeEnum(NovelStatus).optional(),
        categoryId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const novel = await ctx.prisma.novel.findUnique({ where: { id } });
      if (!novel) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Novel not found" });
      }
      if (novel.authorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not own this novel" });
      }

      return ctx.prisma.novel.update({
        where: { id },
        data,
      });
    }),

  search: publicProcedure
    .input(
      z.object({
        keyword: z.string().min(1),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const { keyword, page, limit } = input;

      const where = {
        OR: [
          { title: { contains: keyword } },
          { summary: { contains: keyword } },
        ],
      };

      const [novels, total] = await Promise.all([
        ctx.prisma.novel.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            author: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
        }),
        ctx.prisma.novel.count({ where }),
      ]);

      return { novels, total, page, limit };
    }),
});
