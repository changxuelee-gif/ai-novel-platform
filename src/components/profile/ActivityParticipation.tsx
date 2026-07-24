"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen, Award, Medal, ChevronRight, Clock, FileText, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileActivity } from "@/lib/mock-data";
import { mockProfileActivities, formatNumber } from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy, book: BookOpen, award: Award, medal: Medal,
};

interface ActivityParticipationProps {
  showHeader?: boolean;
}

export function ActivityParticipation({ showHeader = true }: ActivityParticipationProps) {
  const t = useTranslations("profile.page");

  return (
    <div className="mb-8">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            {t("activityParticipation")}
          </h2>
          <Link href="/activities" className="text-sm text-primary hover:underline flex items-center gap-1">
            {t("viewAllActivities")}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {mockProfileActivities.map((activity: ProfileActivity) => {
          const Icon = iconMap[activity.icon] || Trophy;
          return (
            <div key={activity.id} className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", activity.color)}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-foreground truncate">{activity.title}</h3>
                  <Badge className={cn(
                    "text-[10px] h-4 px-1.5",
                    activity.status === "ongoing" ? "bg-green-500/10 text-green-600" : "bg-gray-500/10 text-gray-500"
                  )}>
                    {activity.status === "ongoing" ? t("ongoing") : t("ended")}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
                  {activity.remainingTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t("remainingTime")}{activity.remainingTime}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {t("submissions")}{activity.submissions}{activity.submissions === 0 ? ` · ${t("noSubmission")}` : ""}
                  </span>
                  {activity.rank && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {t("currentRank")}: 第{activity.rank}名
                    </span>
                  )}
                  {activity.totalReads && (
                    <span className="text-amber-500">{formatNumber(activity.totalReads)}{t("reads")}</span>
                  )}
                  {activity.reward && (
                    <span className="text-amber-500">{t("reward")}: {activity.reward}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
