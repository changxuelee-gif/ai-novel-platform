import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "@/server/trpc";

export const chapterRouter = router({
  list: publicProcedure
    .input(
      z.object({
        novelId: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const { novelId, page, limit } = input;

      const where = { novelId };

      const [chapters, total] = await Promise.all([
        ctx.prisma.chapter.findMany({
          where,
          select: {
            id: true,
            title: true,
            content: true,
            order: true,
            isPremium: true,
            novelId: true,
            createdAt: true,
          },
          orderBy: { order: "asc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        ctx.prisma.chapter.count({ where }),
      ]);

      return { chapters, total };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const chapter = await ctx.prisma.chapter.findUnique({
        where: { id: input.id },
        include: {
          branches: {
            select: {
              id: true,
              optionText: true,
              targetChapterId: true,
              condition: true,
            },
          },
        },
      });

      if (!chapter) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Chapter not found" });
      }

      return chapter;
    }),

  create: protectedProcedure
    .input(
      z.object({
        novelId: z.string(),
        title: z.string().min(1),
        content: z.string().min(1),
        order: z.number(),
        isPremium: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const novel = await ctx.prisma.novel.findUnique({
        where: { id: input.novelId },
        select: { authorId: true },
      });

      if (!novel) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Novel not found" });
      }
      if (novel.authorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not own this novel" });
      }

      return ctx.prisma.chapter.create({
        data: {
          title: input.title,
          content: input.content,
          order: input.order,
          isPremium: input.isPremium ?? false,
          novelId: input.novelId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        content: z.string().optional(),
        order: z.number().optional(),
        isPremium: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const chapter = await ctx.prisma.chapter.findUnique({
        where: { id },
        include: { novel: { select: { authorId: true } } },
      });

      if (!chapter) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Chapter not found" });
      }
      if (chapter.novel.authorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not own this novel" });
      }

      return ctx.prisma.chapter.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const chapter = await ctx.prisma.chapter.findUnique({
        where: { id: input.id },
        include: { novel: { select: { authorId: true } } },
      });

      if (!chapter) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Chapter not found" });
      }
      if (chapter.novel.authorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not own this novel" });
      }

      return ctx.prisma.chapter.delete({
        where: { id: input.id },
      });
    }),
});
