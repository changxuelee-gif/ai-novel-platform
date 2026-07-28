import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "@/server/trpc";
import { EarningType } from "@/generated/prisma/client";

export const userRouter = router({
  getProfile: publicProcedure
    .input(z.object({ id: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const userId = input?.id ?? ctx.session?.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User id is required when not authenticated",
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          image: true,
          bio: true,
          role: true,
          coins: true,
          createdAt: true,
          _count: {
            select: {
              novels: true,
              followers: true,
              following: true,
              favorites: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return user;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              followers: true,
              following: true,
              favorites: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return user;
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
      return user;
    }),

  getStats: publicProcedure
    .input(z.object({ id: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const userId = input?.id ?? ctx.session?.user?.id;
      if (!userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User id is required when not authenticated",
        });
      }

      const [novelCount, followerCount, followingCount, favoriteCount, novels] =
        await Promise.all([
          ctx.prisma.novel.count({ where: { authorId: userId } }),
          ctx.prisma.follow.count({ where: { followingId: userId } }),
          ctx.prisma.follow.count({ where: { followerId: userId } }),
          ctx.prisma.favorite.count({ where: { userId } }),
          ctx.prisma.novel.findMany({
            where: { authorId: userId },
            select: { views: true },
          }),
        ]);

      const totalViews = novels.reduce((sum, novel) => sum + novel.views, 0);

      return { novelCount, followerCount, followingCount, favoriteCount, totalViews };
    }),

  getEarnings: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1).optional(),
        limit: z.number().min(1).max(100).default(20).optional(),
        type: z.nativeEnum(EarningType).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const skip = (page - 1) * limit;

      const where: Record<string, unknown> = { userId: ctx.session.user.id };
      if (input?.type) {
        where.type = input.type;
      }

      const [earnings, total] = await Promise.all([
        ctx.prisma.earning.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        ctx.prisma.earning.count({ where }),
      ]);

      return { earnings, total, page, limit };
    }),

  getMyNovels: protectedProcedure.query(async ({ ctx }) => {
    const novels = await ctx.prisma.novel.findMany({
      where: { authorId: ctx.session.user.id },
      include: {
        category: true,
        _count: { select: { chapters: true, favorites: true, comments: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return novels;
  }),
});
