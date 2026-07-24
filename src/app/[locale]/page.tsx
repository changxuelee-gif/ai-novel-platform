"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { RecentlyRead } from "@/components/home/RecentlyRead";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { ActivitySection } from "@/components/home/ActivitySection";
import { NovelSection } from "@/components/home/NovelSection";
import { RightSidebar } from "@/components/home/RightSidebar";

export default function HomePage() {
  return (
    <AppLayout>
      <div className="flex gap-6 p-6 bg-gray-50 min-h-full">
        {/* 主内容区 */}
        <div className="flex-1 min-w-0 space-y-8">
          <RecentlyRead />
          <FeaturedSection />
          <ActivitySection />
          <NovelSection />
        </div>
        {/* 右侧边栏 */}
        <div className="hidden lg:block w-[300px] shrink-0">
          <RightSidebar />
        </div>
      </div>
    </AppLayout>
  );
}
