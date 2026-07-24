import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { Context } from "./context";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
    }
    return next({
      ctx: {
        session: {
          ...ctx.session,
          user: {
            ...ctx.session.user,
            id: ctx.session.user.id,
          },
        },
      },
    });
  })
);
