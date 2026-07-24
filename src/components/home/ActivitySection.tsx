"use client";

import { useTranslations } from "next-intl";
import { activities } from "@/lib/mock-data";
import { ActivityCard } from "./ActivityCard";

export function ActivitySection() {
  const t = useTranslations("home");

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold">{t("activity")}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </section>
  );
}
