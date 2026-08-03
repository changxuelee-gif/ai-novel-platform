import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "@/server/trpc";

const DAILY_CHECKIN_REWARD = 50;

function getDateOnly(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function calcConsecutiveDays(checkedDates: Set<number>, today: Date, hasToday: boolean): number {
  let streak = hasToday ? 1 : 0;
  let checkDate = addDays(today, -1);

  for (let i = 0; i < 365; i++) {
    const ts = getDateOnly(checkDate).getTime();
    if (checkedDates.has(ts)) {
      streak++;
      checkDate = addDays(checkDate, -1);
    } else {
      break;
    }
  }
  return streak;
}

export const checkinRouter = router({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const today = getDateOnly(new Date());
    const weekAgo = addDays(today, -6);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const thirtyDaysAgo = addDays(today, -30);

    const [todayCheckin, recentCheckins, monthCheckins, last30Days] = await Promise.all([
      ctx.prisma.checkIn.findUnique({
        where: { userId_checkDate: { userId, checkDate: today } },
        select: { id: true },
      }),
      ctx.prisma.checkIn.findMany({
        where: { userId, checkDate: { gte: weekAgo, lte: today } },
        select: { checkDate: true },
        orderBy: { checkDate: "asc" },
      }),
      ctx.prisma.checkIn.findMany({
        where: { userId, checkDate: { gte: monthStart, lt: nextMonthStart } },
        select: { checkDate: true },
        orderBy: { checkDate: "asc" },
      }),
      ctx.prisma.checkIn.findMany({
        where: { userId, checkDate: { gte: thirtyDaysAgo, lte: today } },
        select: { checkDate: true },
      }),
    ]);

    const checkedDatesSet = new Set(
      last30Days.map((c) => getDateOnly(c.checkDate).getTime())
    );

    const recentDaysMap = new Set(
      recentCheckins.map((c) => getDateOnly(c.checkDate).getTime())
    );
    const recentDays: boolean[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = addDays(today, -i);
      recentDays.push(recentDaysMap.has(getDateOnly(d).getTime()));
    }

    const monthDays = monthCheckins.map((c) => c.checkDate);
    const consecutiveDays = calcConsecutiveDays(checkedDatesSet, today, !!todayCheckin);
    const totalCheckins = await ctx.prisma.checkIn.count({ where: { userId } });

    return {
      hasCheckedInToday: !!todayCheckin,
      consecutiveDays,
      totalCheckins,
      recentDays,
      monthDays,
      reward: DAILY_CHECKIN_REWARD,
    };
  }),

  doCheckin: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const today = getDateOnly(new Date());

    const existing = await ctx.prisma.checkIn.findUnique({
      where: { userId_checkDate: { userId, checkDate: today } },
    });

    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "今日已签到",
      });
    }

    const thirtyDaysAgo = addDays(today, -30);

    const result = await ctx.prisma.$transaction(async (tx) => {
      await tx.checkIn.create({
        data: { userId, checkDate: today },
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { coins: { increment: DAILY_CHECKIN_REWARD } },
        select: { coins: true },
      });

      const recentCheckins = await tx.checkIn.findMany({
        where: { userId, checkDate: { gte: thirtyDaysAgo, lte: today } },
        select: { checkDate: true },
      });

      const checkedDatesSet = new Set(
        recentCheckins.map((c) => getDateOnly(c.checkDate).getTime())
      );
      const consecutiveDays = calcConsecutiveDays(checkedDatesSet, today, true);

      return {
        coins: updatedUser.coins,
        consecutiveDays,
        reward: DAILY_CHECKIN_REWARD,
      };
    });

    return { success: true, ...result };
  }),
});
