import { prisma } from "@/lib/prisma";

const DAILY_QUOTA = 10000; // 每日配额：10000字

export async function checkQuota(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  // 获取今天的开始时间
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // 查询今日已使用量（outputTokens 总和）
  const todayUsage = await prisma.aIUsageLog.aggregate({
    where: {
      userId,
      createdAt: { gte: startOfDay },
    },
    _sum: { outputTokens: true },
  });

  const used = todayUsage._sum.outputTokens || 0;
  const remaining = Math.max(0, DAILY_QUOTA - used);

  return { allowed: remaining > 0, remaining };
}

export async function recordUsage(userId: string, action: string, inputTokens: number, outputTokens: number) {
  await prisma.aIUsageLog.create({
    data: { userId, action, inputTokens, outputTokens },
  });
}
