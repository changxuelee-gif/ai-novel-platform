"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { DataOverview } from "@/components/profile/DataOverview";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileBookshelf } from "@/components/profile/ProfileBookshelf";
import { ProfileWorks } from "@/components/profile/ProfileWorks";
import { ActivityParticipation } from "@/components/profile/ActivityParticipation";
import { CheckInCalendar } from "@/components/profile/CheckInCalendar";
import { trpc } from "@/trpc/client";

type TabType = "bookshelf" | "works" | "activity";

const defaultUser = {
  id: "1",
  name: "用户",
  avatar: "",
  vip: false,
  bio: "",
  following: 0,
  followers: 0,
  works: 0,
  banner: "",
};

// Assets and data overview are derived from API data below

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("bookshelf");

  const { data: userData } = trpc.user.getProfile.useQuery();
  const { data: earningsData } = trpc.user.getEarnings.useQuery();

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

  const totalEarnings = earningsData?.earnings.reduce((sum, e) => sum + e.amount, 0) ?? 0;
  
  const assets = {
    coins: userData?.coins ?? 0,
    membershipExpiry: "",
  };

  const dataOverview = {
    booksRead: 0,
    wordsWritten: 0,
    followers: userData?._count?.followers ?? 0,
    earnings: totalEarnings,
    booksReadChange: 0,
    wordsWrittenChange: 0,
    followersChange: 0,
    earningsChange: 0,
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <ProfileSidebar user={user} assets={assets} />

        <div className="flex-1 min-w-0">
          <DataOverview data={dataOverview} />

          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="bg-card rounded-lg border border-border/50 p-6">
            {activeTab === "bookshelf" && <ProfileBookshelf showHeader={false} />}
            {activeTab === "works" && <ProfileWorks showHeader={false} />}
            {activeTab === "activity" && <ActivityParticipation showHeader={false} />}
          </div>

          <CheckInCalendar />
        </div>
      </div>
    </AppLayout>
  );
}
