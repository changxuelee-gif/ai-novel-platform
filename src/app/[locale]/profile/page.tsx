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
import {
  mockUserProfile,
  mockUserAssets,
  mockDataOverview,
} from "@/lib/mock-data";

type TabType = "bookshelf" | "works" | "activity";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("bookshelf");

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <ProfileSidebar user={mockUserProfile} assets={mockUserAssets} />

        <div className="flex-1 min-w-0">
          <DataOverview data={mockDataOverview} />

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
