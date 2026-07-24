import { TRPCError } from "@trpc/server";
import { UserRole } from "@/generated/prisma/client";
import { t } from "./index";

export const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const hasRole = (allowedRoles: UserRole[]) =>
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { role: true },
    });

    if (!user || !allowedRoles.includes(user.role)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient permissions" });
    }

    return next({
      ctx: {
        session: ctx.session,
      },
    });
  });
