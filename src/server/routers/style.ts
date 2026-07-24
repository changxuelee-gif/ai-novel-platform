import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "@/server/trpc";

export const styleRouter = router({
  list: publicProcedure
    .input(
      z.object({
        filter: z.enum(["public", "mine"]).default("public").optional(),
        page: z.number().min(1).default(1).optional(),
        limit: z.number().min(1).max(100).default(20).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const filter = input?.filter ?? "public";
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const skip = (page - 1) * limit;

      let where: Record<string, unknown> = {};

      if (filter === "mine") {
        if (!ctx.session?.user?.id) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
        }
        where = { creatorId: ctx.session.user.id };
      } else {
        where = { isPublic: true };
      }

      const [styles, total] = await Promise.all([
        ctx.prisma.writingStyle.findMany({
          where,
          include: {
            creator: { select: { id: true, name: true, avatar: true } },
          },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        ctx.prisma.writingStyle.count({ where }),
      ]);

      return { styles, total };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        sampleText: z.string().optional(),
        tags: z.array(z.string()).optional(),
        isPublic: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const style = await ctx.prisma.writingStyle.create({
        data: {
          ...input,
          tags: JSON.stringify(input.tags || []),
          creatorId: ctx.session.user.id,
        },
      });
      return style;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const style = await ctx.prisma.writingStyle.findUnique({
        where: { id: input.id },
        include: {
          creator: { select: { id: true, name: true, avatar: true } },
        },
      });

      if (!style) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Writing style not found" });
      }

      if (!style.isPublic) {
        if (!ctx.session?.user?.id || ctx.session.user.id !== style.creatorId) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
      }

      return style;
    }),
});
