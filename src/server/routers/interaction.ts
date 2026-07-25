import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "@/server/trpc";

export const interactionRouter = router({
  favorite: protectedProcedure
    .input(z.object({ novelId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existing = await ctx.prisma.favorite.findUnique({
        where: { userId_novelId: { userId, novelId: input.novelId } },
      });

      if (existing) {
        await ctx.prisma.favorite.delete({ where: { id: existing.id } });
        return { favorited: false };
      }

      await ctx.prisma.favorite.create({
        data: { userId, novelId: input.novelId },
      });

      return { favorited: true };
    }),

  rate: protectedProcedure
    .input(
      z.object({
        novelId: z.string(),
        score: z.number().min(1).max(5),
        comment: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const rating = await ctx.prisma.rating.upsert({
        where: { userId_novelId: { userId, novelId: input.novelId } },
        update: { score: input.score, comment: input.comment },
        create: {
          userId,
          novelId: input.novelId,
          score: input.score,
          comment: input.comment,
        },
      });

      return rating;
    }),

  comment: protectedProcedure
    .input(
      z.object({
        novelId: z.string(),
        chapterId: z.string().optional(),
        content: z.string(),
        parentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (input.parentId) {
        const parent = await ctx.prisma.comment.findUnique({
          where: { id: input.parentId },
        });

        if (!parent) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Parent comment not found",
          });
        }
      }

      const comment = await ctx.prisma.comment.create({
        data: {
          userId,
          novelId: input.novelId,
          chapterId: input.chapterId,
          content: input.content,
          parentId: input.parentId,
        },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
      });

      return comment;
    }),

  getProgress: protectedProcedure
    .input(z.object({ novelId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const progress = await ctx.prisma.readingProgress.findUnique({
        where: { userId_novelId: { userId, novelId: input.novelId } },
        include: {
          chapter: { select: { id: true, title: true, order: true } },
        },
      });

      return progress ?? null;
    }),

  saveProgress: protectedProcedure
    .input(
      z.object({
        novelId: z.string(),
        chapterId: z.string(),
        progress: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const saved = await ctx.prisma.readingProgress.upsert({
        where: { userId_novelId: { userId, novelId: input.novelId } },
        update: {
          chapterId: input.chapterId,
          progress: input.progress,
        },
        create: {
          userId,
          novelId: input.novelId,
          chapterId: input.chapterId,
          progress: input.progress,
        },
      });

      return saved;
    }),

  getBookshelf: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const favorites = await ctx.prisma.favorite.findMany({
      where: { userId },
      include: {
        novel: {
          include: {
            author: { select: { name: true } },
            category: true,
            _count: { select: { chapters: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return favorites.map((fav) => ({
      ...fav,
      chapterOrder: 0,
    }));
  }),

  getReadingProgresses: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const progresses = await ctx.prisma.readingProgress.findMany({
      where: { userId },
      include: {
        novel: { select: { id: true, title: true, cover: true } },
        chapter: { select: { id: true, title: true, order: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return progresses.map((p) => ({
      ...p,
      chapterOrder: p.chapter.order,
    }));
  }),

  getCommentsByNovel: publicProcedure
    .input(z.object({
      novelId: z.string(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const { novelId, page, limit } = input;

      const [comments, total] = await Promise.all([
        ctx.prisma.comment.findMany({
          where: { novelId },
          include: {
            user: { select: { id: true, name: true, avatar: true, image: true } },
            novel: { select: { id: true, title: true, cover: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        ctx.prisma.comment.count({ where: { novelId } }),
      ]);

      return { comments, total, page, limit };
    }),
});
