"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { ActivityBanner } from "@/components/activities/ActivityBanner";
import { ActivityCategoryTabs } from "@/components/activities/ActivityCategoryTabs";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { ActivityWorkRanking } from "@/components/activities/ActivityWorkRanking";
import {
  activityBanner,
  activityCategories,
  activityCards,
  pastActivities,
  activityWorkRankings,
} from "@/lib/mock-data";

export default function ActivitiesPage() {
  const t = useTranslations("activities");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCards = useMemo(() => {
    if (selectedCategory === "all") return activityCards;
    return activityCards.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6">
        {/* Banner */}
        <ActivityBanner banner={activityBanner} />

        {/* Category tabs */}
        <ActivityCategoryTabs
          categories={activityCategories}
          selected={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Active activities grid */}
        <section>
          <h3 className="mb-4 text-lg font-bold">{t("hotActivities")}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCards.map((card) => (
              <ActivityCard key={card.id} activity={card} />
            ))}

            {/* Placeholder card */}
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
              <span className="text-2xl">🎉</span>
              <span className="text-sm">{t("moreComing")}</span>
            </div>
          </div>
        </section>

        {/* Past activities */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">{t("pastActivities")}</h3>
            <span className="text-sm text-muted-foreground">
              {t("totalPast", { count: pastActivities.length })}
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {pastActivities.map((card) => (
              <div key={card.id} className="w-64 shrink-0">
                <ActivityCard activity={card} />
              </div>
            ))}
          </div>
        </section>

        {/* Work ranking */}
        <section>
          <ActivityWorkRanking
            rankings={activityWorkRankings}
            activityTitle={activityBanner.title}
          />
        </section>
      </div>
    </AppLayout>
  );
}
