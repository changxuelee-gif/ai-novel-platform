"use client";

import { useTranslations } from "next-intl";
import { trpc } from "@/trpc/client";
import { toActivityCard } from "@/lib/transformers";
import { ActivityCard } from "./ActivityCard";

export function ActivitySection() {
  const t = useTranslations("home");
  const { data, isLoading } = trpc.activity.list.useQuery({
    page: 1,
    limit: 4,
  });

  const activities = (data?.activities ?? []).map(toActivityCard);

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold">{t("activity")}</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[120px] animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </section>
  );
}
