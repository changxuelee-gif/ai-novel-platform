"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { TrendingUp, TrendingDown, Minus, Star, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityWorkItem } from "@/types/novel";

interface ActivityWorkRankingProps {
  rankings: Record<string, ActivityWorkItem[]>;
  activityTitle: string;
}

const rankTabs = [
  { key: "popularity", labelKey: "popularityRank" as const },
  { key: "newbook", labelKey: "newBookRank" as const },
  { key: "rating", labelKey: "ratingRank" as const },
];

const medalColors: Record<number, string> = {
  1: "bg-amber-500/20 text-amber-500 border-amber-500/30",
  2: "bg-gray-400/20 text-gray-400 border-gray-400/30",
  3: "bg-orange-600/20 text-orange-600 border-orange-600/30",
};

function TrendIndicator({ value }: { value?: number }) {
  if (value === undefined || value === 0) {
    return <Minus className="size-3.5 text-muted-foreground" />;
  }
  if (value > 0) {
    return (
      <span className="flex items-center gap-0.5 text-emerald-500">
        <TrendingUp className="size-3.5" />
        <span className="text-xs">{value}</span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-red-500">
      <TrendingDown className="size-3.5" />
      <span className="text-xs">{Math.abs(value)}</span>
    </span>
  );
}

export function ActivityWorkRanking({
  rankings,
}: ActivityWorkRankingProps) {
  const t = useTranslations("activities");
  const [activeTab, setActiveTab] = useState("popularity");

  const items = rankings[activeTab] ?? [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">{t("workRanking")}</h3>

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {rankTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Ranking list */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50",
              item.rank <= 3 ? "border-border bg-muted/30" : "border-border"
            )}
          >
            {/* Rank number */}
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold",
                item.rank <= 3
                  ? medalColors[item.rank]
                  : "text-muted-foreground"
              )}
            >
              {item.rank}
            </div>

            {/* Cover */}
            <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
              <img
                src={item.cover}
                alt={item.title}
                className="size-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-medium">{item.title}</h4>
              <p className="truncate text-xs text-muted-foreground">
                {item.author}
              </p>
            </div>

            {/* Stats */}
            <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="size-3.5 text-amber-500" />
                {item.rating}
              </span>
              <span className="hidden items-center gap-1 sm:flex">
                <Eye className="size-3.5" />
                {item.views >= 10000
                  ? (item.views / 10000).toFixed(1) + "万"
                  : item.views.toLocaleString()}
              </span>
              <TrendIndicator value={item.trend} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
