"use client";

import { useTranslations } from "next-intl";
import { Trophy, Users, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ActivityBannerData } from "@/types/novel";

interface ActivityBannerProps {
  banner: ActivityBannerData;
}

export function ActivityBanner({ banner }: ActivityBannerProps) {
  const t = useTranslations("activities");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-r p-6 md:p-8",
        banner.themeColor
      )}
    >
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 space-y-3">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            {banner.title}
          </h2>
          <p className="text-sm text-white/80 md:text-base">
            {banner.subtitle}
          </p>
          <p className="hidden text-sm text-white/70 md:block">
            {banner.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-sm text-white/90">
            <span className="flex items-center gap-1.5">
              <Users className="size-4" />
              {t("participants")}: {banner.participants.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="size-4" />
              {t("submissions")}: {banner.submissions.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {t("remainingTime")}: {banner.remainingTime}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button className="bg-white text-gray-900 hover:bg-white/90">
              {t("participate")}
            </Button>
            <Button
              variant="ghost"
              className="border border-white/40 text-white hover:bg-white/10"
            >
              {t("viewRewards")}
            </Button>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="flex size-28 items-center justify-center rounded-full bg-white/10">
            <Trophy className="size-16 text-white/80" />
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-white/5" />
      <div className="absolute right-1/4 top-1/2 size-20 rounded-full bg-white/5" />
    </div>
  );
}
