import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

const DAILY_QUOTA = 10000; // 每日配额：10000字
const QUOTA_TTL = 86400; // 24小时（秒）

function getTodayKey(userId: string): string {
  const today = new Date().toISOString().split("T")[0];
  return `ai:quota:${userId}:${today}`;
}

export async function checkQuota(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const key = getTodayKey(userId);

  // Try Redis first for fast lookup
  try {
    const usedStr = await redis.get(key);
    const used = usedStr ? parseInt(usedStr, 10) : 0;
    const remaining = Math.max(0, DAILY_QUOTA - used);
    return { allowed: remaining > 0, remaining };
  } catch {
    // Fallback to database if Redis is unavailable
  }

  // Fallback: query database
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

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
  // Record in database
  await prisma.aIUsageLog.create({
    data: { userId, action, inputTokens, outputTokens },
  });

  // Update Redis counter
  try {
    const key = getTodayKey(userId);
    await redis.incrBy(key, outputTokens);
    await redis.expire(key, QUOTA_TTL);
  } catch {
    // Redis failure is non-critical; DB is the source of truth
  }
}
