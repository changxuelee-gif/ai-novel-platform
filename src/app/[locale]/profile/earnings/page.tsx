"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { EarningsOverview } from "@/components/profile/EarningsOverview";
import { EarningsPanel } from "@/components/profile/EarningsPanel";
import { EarningsTrendChart } from "@/components/profile/EarningsTrendChart";
import { TopNovelsRanking } from "@/components/profile/TopNovelsRanking";
import { trpc } from "@/trpc/client";
import { mockUserProfile, mockUserAssets } from "@/lib/mock-data";

export default function EarningsPage() {
  const [period, setPeriod] = useState<"7d" | "30d">("7d");

  const { data: earningsData, isLoading } = trpc.user.getEarnings.useQuery();

  const totalEarnings = earningsData?.earnings.reduce((sum, e) => sum + e.amount, 0) ?? 0;
  const mockEarningsData = {
    totalReads: 0,
    totalWords: 0,
    totalFavorites: 0,
    totalCoins: totalEarnings,
    currentIncome: totalEarnings,
    pendingIncome: 0,
    withdrawable: totalEarnings,
  };

  const trendData = Array.from({ length: period === "7d" ? 7 : 30 }, (_, i) => ({
    label: `${i + 1}日`,
    reads: Math.floor(Math.random() * 100),
    income: Math.floor(Math.random() * 100),
  }));

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <ProfileSidebar user={mockUserProfile} assets={mockUserAssets} />

        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-foreground">数据与收益中心</h1>
            <p className="text-sm text-muted-foreground mt-1">查看您的创作数据和收益详情</p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : (
            <>
              <EarningsOverview data={mockEarningsData} />
              <EarningsPanel data={mockEarningsData} />
              <EarningsTrendChart data={trendData} period={period} onPeriodChange={setPeriod} />
              <TopNovelsRanking novels={[]} />
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
