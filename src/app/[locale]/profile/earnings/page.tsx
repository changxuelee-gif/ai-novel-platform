"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { EarningsOverview } from "@/components/profile/EarningsOverview";
import { EarningsPanel } from "@/components/profile/EarningsPanel";
import { EarningsTrendChart } from "@/components/profile/EarningsTrendChart";
import { TopNovelsRanking } from "@/components/profile/TopNovelsRanking";
import { mockUserProfile, mockUserAssets, mockEarningsData, mockTrendData7d, mockTrendData30d, mockTopNovels } from "@/lib/mock-data";

export default function EarningsPage() {
  const [period, setPeriod] = useState<"7d" | "30d">("7d");

  const trendData = period === "7d" ? mockTrendData7d : mockTrendData30d;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <ProfileSidebar user={mockUserProfile} assets={mockUserAssets} />

        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-foreground">数据与收益中心</h1>
            <p className="text-sm text-muted-foreground mt-1">查看您的创作数据和收益详情</p>
          </div>

          <EarningsOverview data={mockEarningsData} />
          <EarningsPanel data={mockEarningsData} />
          <EarningsTrendChart data={trendData} period={period} onPeriodChange={setPeriod} />
          <TopNovelsRanking novels={mockTopNovels} />
        </div>
      </div>
    </AppLayout>
  );
}
