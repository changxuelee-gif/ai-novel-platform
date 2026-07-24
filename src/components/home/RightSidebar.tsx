"use client";

import { DailyCheckin } from "./DailyCheckin";
import { RankingList } from "./RankingList";
import { AICreatorCard } from "./AICreatorCard";

export function RightSidebar() {
  return (
    <div className="space-y-4">
      <DailyCheckin />
      <RankingList />
      <AICreatorCard />
    </div>
  );
}
