"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { EarningsOverview } from "@/components/profile/EarningsOverview";
import { EarningsPanel } from "@/components/profile/EarningsPanel";
import { EarningsTrendChart } from "@/components/profile/EarningsTrendChart";
import { TopNovelsRanking } from "@/components/profile/TopNovelsRanking";
import { trpc } from "@/trpc/client";
import { Wallet } from "lucide-react";

const defaultUser = {
  id: "",
  name: "用户",
  avatar: "",
  vip: false,
  bio: "",
  following: 0,
  followers: 0,
  works: 0,
  banner: "",
};

export default function EarningsPage() {
  const [period, setPeriod] = useState<"7d" | "30d">("7d");

  const { data: userData } = trpc.user.getProfile.useQuery();
  const { data: earningsData, isLoading } = trpc.user.getEarnings.useQuery();
  const { data: novels } = trpc.user.getMyNovels.useQuery();

  const user = userData
    ? {
        ...defaultUser,
        id: userData.id,
        name: userData.name ?? "用户",
        avatar: userData.avatar ?? userData.image ?? "",
        vip: userData.role === "VERIFIED" || userData.role === "AUTHOR",
        bio: userData.bio ?? "",
        following: userData._count?.following ?? 0,
        followers: userData._count?.followers ?? 0,
        works: userData._count?.novels ?? 0,
      }
    : defaultUser;

  const assets = {
    coins: userData?.coins ?? 0,
    membershipExpiry: "",
  };

  const totalEarnings = earningsData?.earnings.reduce((sum, e) => sum + e.amount, 0) ?? 0;
  const mockEarningsData = {
    totalReads: novels?.reduce((sum, n) => sum + n.views, 0) ?? 0,
    totalWords: 0,
    totalFavorites: novels?.reduce((sum, n) => sum + (n._count?.favorites ?? 0), 0) ?? 0,
    totalCoins: totalEarnings,
    currentIncome: totalEarnings,
    pendingIncome: 0,
    withdrawable: totalEarnings,
  };

  const trendData = Array.from({ length: period === "7d" ? 7 : 30 }, (_, i) => ({
    label: `${i + 1}日`,
    reads: 0,
    income: 0,
  }));

  const topNovels = (novels ?? []).sort((a, b) => b.views - a.views).slice(0, 5).map((n, i) => ({
    id: n.id,
    title: n.title,
    cover: n.cover ?? "",
    reads: n.views,
    income: 0,
    rank: i + 1,
  }));

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <ProfileSidebar user={user} assets={assets} />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Wallet className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">数据与收益中心</h1>
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
                <TopNovelsRanking novels={topNovels} />
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
