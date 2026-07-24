"use client";

import { useTranslations } from "next-intl";
import {
  Flame,
  Sparkles,
  Star,
  TrendingUp,
  CheckCircle,
  FileSignature,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { rankingTypes, rankingCategories, rankingTimeRanges } from "@/lib/mock-data";
import type { RankingType, RankingTimeRange } from "@/types/novel";

const iconMap = {
  flame: Flame,
  sparkles: Sparkles,
  star: Star,
  "trending-up": TrendingUp,
  "check-circle": CheckCircle,
  "file-signature": FileSignature,
} as const;

interface RankingTabsProps {
  selectedType: RankingType;
  selectedTimeRange: RankingTimeRange;
  selectedCategory: string;
  onTypeChange: (type: RankingType) => void;
  onTimeRangeChange: (range: RankingTimeRange) => void;
  onCategoryChange: (category: string) => void;
}

export function RankingTabs({
  selectedType,
  selectedTimeRange,
  selectedCategory,
  onTypeChange,
  onTimeRangeChange,
  onCategoryChange,
}: RankingTabsProps) {
  const t = useTranslations("ranking");

  return (
    <div className="space-y-3">
      {/* Row 1: Ranking type tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
        {rankingTypes.map((type) => {
          const Icon = iconMap[type.icon as keyof typeof iconMap];
          return (
            <button
              key={type.key}
              onClick={() => onTypeChange(type.key as RankingType)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                selectedType === type.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {Icon && <Icon className="size-4" />}
              {t(type.key as "popularity")}
            </button>
          );
        })}
      </div>

      {/* Row 2: Category pills + time range dropdown */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 gap-2 overflow-x-auto scrollbar-hide py-1">
          {rankingCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onCategoryChange(cat.key)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                selectedCategory === cat.key
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-transparent"
              )}
            >
              {cat.key === "all" ? t("all") : cat.label}
            </button>
          ))}
        </div>

        {/* Time range dropdown */}
        <div className="relative shrink-0">
          <select
            value={selectedTimeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as RankingTimeRange)}
            className="appearance-none rounded-lg border border-border bg-muted px-3 py-1.5 pr-8 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            {rankingTimeRanges.map((range) => (
              <option key={range.key} value={range.key}>
                {t(range.key as "all")}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
