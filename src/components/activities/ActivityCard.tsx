"use client";

import { useTranslations } from "next-intl";
import { Users, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ActivityCardDataExtended } from "@/types/novel";

interface ActivityCardProps {
  activity: ActivityCardDataExtended;
}

const statusConfig = {
  ongoing: { labelKey: "ongoing" as const, className: "bg-emerald-500/20 text-emerald-400" },
  upcoming: { labelKey: "upcoming" as const, className: "bg-blue-500/20 text-blue-400" },
  ended: { labelKey: "ended" as const, className: "bg-gray-500/20 text-gray-400" },
};

export function ActivityCard({ activity }: ActivityCardProps) {
  const t = useTranslations("activities");
  const status = statusConfig[activity.status];

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Gradient header */}
      <div
        className={cn(
          "relative flex h-28 items-end bg-gradient-to-r p-4",
          activity.themeColor
        )}
      >
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white">{activity.title}</h3>
          <p className="text-xs text-white/80">{activity.subtitle}</p>
        </div>
        <div className="absolute right-3 top-3">
          <Badge className={cn("border-0 text-xs", status.className)}>
            {t(status.labelKey)}
          </Badge>
        </div>
        {/* Decorative */}
        <div className="absolute -right-4 -top-4 size-16 rounded-full bg-white/10" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            {activity.startDate} - {activity.endDate}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {activity.participants.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Gift className="size-3.5" />
            {activity.reward}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-auto space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t("remainingTime")}</span>
            <span>{activity.progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r transition-all",
                activity.themeColor
              )}
              style={{ width: `${activity.progress}%` }}
            />
          </div>
        </div>

        <Button
          size="sm"
          className="w-full"
          disabled={activity.status === "ended"}
        >
          {activity.status === "ended" ? t("ended") : t("joinNow")}
        </Button>
      </div>
    </div>
  );
}
