"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { ActivityBanner } from "@/components/activities/ActivityBanner";
import { ActivityCategoryTabs } from "@/components/activities/ActivityCategoryTabs";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { ActivityWorkRanking } from "@/components/activities/ActivityWorkRanking";
import { trpc } from "@/trpc/client";
import { toActivityCard } from "@/lib/transformers";
import { activityCategories } from "@/lib/mock-data";

export default function ActivitiesPage() {
  const t = useTranslations("activities");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data, isLoading } = trpc.activity.list.useQuery({
    page: 1,
    limit: 20,
  });

  const allCards = useMemo(
    () => (data?.activities ?? []).map(toActivityCard),
    [data]
  );

  const filteredCards = useMemo(() => {
    if (selectedCategory === "all") return allCards;
    return allCards.filter((c) => c.category === selectedCategory);
  }, [allCards, selectedCategory]);

  const banner = allCards.length > 0
    ? { ...allCards[0], description: allCards[0].subtitle || "" }
    : null;

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6">
        {/* Banner */}
        {banner && <ActivityBanner banner={banner} />}

        {/* Category tabs */}
        <ActivityCategoryTabs
          categories={activityCategories}
          selected={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Active activities grid */}
        <section>
          <h3 className="mb-4 text-lg font-bold">{t("hotActivities")}</h3>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : (
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
          )}
        </section>

        {/* Past activities */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">{t("pastActivities")}</h3>
            <span className="text-sm text-muted-foreground">
              {t("totalPast", { count: 0 })}
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            <div className="text-sm text-muted-foreground py-8">
              暂无历史活动
            </div>
          </div>
        </section>

        {/* Work ranking */}
        {banner && (
          <section>
            <ActivityWorkRanking
              rankings={{}}
              activityTitle={banner.title}
            />
          </section>
        )}
      </div>
    </AppLayout>
  );
}
