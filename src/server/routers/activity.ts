import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "@/server/trpc";
import { ActivityStatus } from "@/generated/prisma/client";

export const activityRouter = router({
  list: publicProcedure
    .input(
      z.object({
        status: z.nativeEnum(ActivityStatus).optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { status, page, limit } = input;
      const where = status ? { status } : {};

      const [activities, total] = await Promise.all([
        ctx.prisma.activity.findMany({
          where,
          orderBy: { startDate: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
        ctx.prisma.activity.count({ where }),
      ]);

      return { activities, total, page, limit };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const activity = await ctx.prisma.activity.findUnique({
        where: { id: input.id },
        include: {
          submissions: {
            include: {
              user: { select: { id: true, name: true, avatar: true } },
              novel: { select: { id: true, title: true, cover: true } },
            },
          },
          _count: { select: { submissions: true } },
        },
      });

      if (!activity) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Activity not found",
        });
      }

      return activity;
    }),

  submit: protectedProcedure
    .input(
      z.object({
        activityId: z.string(),
        novelId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const activity = await ctx.prisma.activity.findUnique({
        where: { id: input.activityId },
      });

      if (!activity || activity.status !== ActivityStatus.ACTIVE) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Activity is not active or does not exist",
        });
      }

      const novel = await ctx.prisma.novel.findFirst({
        where: { id: input.novelId, authorId: userId },
      });

      if (!novel) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Novel not found or does not belong to you",
        });
      }

      const existing = await ctx.prisma.activitySubmission.findFirst({
        where: {
          activityId: input.activityId,
          userId,
          novelId: input.novelId,
        },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already submitted this novel to this activity",
        });
      }

      const submission = await ctx.prisma.activitySubmission.create({
        data: {
          activityId: input.activityId,
          userId,
          novelId: input.novelId,
          status: "PENDING",
        },
      });

      return submission;
    }),
});
