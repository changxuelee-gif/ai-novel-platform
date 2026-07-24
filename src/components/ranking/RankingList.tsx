"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Flame, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import type { RankingListItem } from "@/types/novel";

interface RankingListProps {
  list: RankingListItem[];
}

function getRankBadge(rank: number) {
  if (rank === 1)
    return "bg-amber-400 text-white border-amber-400";
  if (rank === 2)
    return "bg-gray-400 text-white border-gray-400";
  if (rank === 3)
    return "bg-orange-400 text-white border-orange-400";
  return null;
}

function TrendIcon({ trend, value }: { trend: string; value?: number }) {
  if (trend === "up")
    return (
      <span className="flex items-center gap-0.5 text-xs text-green-600 dark:text-green-400">
        <TrendingUp className="size-3.5" />
        {value != null && value > 0 && <span>{value}</span>}
      </span>
    );
  if (trend === "down")
    return (
      <span className="flex items-center gap-0.5 text-xs text-red-500 dark:text-red-400">
        <TrendingDown className="size-3.5" />
        {value != null && value > 0 && <span>{value}</span>}
      </span>
    );
  return <Minus className="size-3.5 text-gray-400" />;
}

export function RankingList({ list }: RankingListProps) {
  const t = useTranslations("ranking");

  if (!list || list.length === 0) return null;

  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="hidden grid-cols-[40px_50px_1fr_80px_80px_60px_80px_60px] items-center gap-3 px-4 py-2 text-xs font-medium text-muted-foreground sm:grid">
        <span className="text-center">{t("rank")}</span>
        <span />
        <span>{t("work")}</span>
        <span>{t("author")}</span>
        <span>{t("category")}</span>
        <span>{t("score")}</span>
        <span>{t("heat")}</span>
        <span>{t("trend")}</span>
      </div>

      {list.map((item, idx) => {
        const rankBadge = getRankBadge(item.rank);
        return (
          <Link
            key={item.id}
            href={`/novel/${item.id}`}
            className={cn(
              "grid grid-cols-[40px_50px_1fr] items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50 sm:grid-cols-[40px_50px_1fr_80px_80px_60px_80px_60px]",
              idx % 2 === 1 && "bg-muted/20"
            )}
          >
            {/* Rank number */}
            <span className="flex items-center justify-center">
              {rankBadge ? (
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-bold border",
                    rankBadge
                  )}
                >
                  {item.rank}
                </span>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">
                  {item.rank}
                </span>
              )}
            </span>

            {/* Cover thumbnail */}
            <div className="h-[70px] w-[50px] overflow-hidden rounded-md shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.cover}
                alt={item.title}
                className="size-full object-cover"
              />
            </div>

            {/* Title + status */}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {item.title}
              </p>
              <Badge
                variant={item.status === "completed" ? "secondary" : "outline"}
                className="mt-1"
              >
                {item.status === "completed" ? t("已完结") : t("连载中")}
              </Badge>
            </div>

            {/* Author */}
            <span className="hidden truncate text-xs text-muted-foreground sm:block">
              {item.author}
            </span>

            {/* Category */}
            <span className="hidden sm:block">
              <Badge variant="outline" className="text-[10px]">
                {item.category}
              </Badge>
            </span>

            {/* Rating */}
            <span className="hidden text-sm font-medium text-foreground sm:block">
              {item.rating.toFixed(1)}
            </span>

            {/* Views / heat */}
            <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
              <Flame className="size-3.5 text-orange-500" />
              {formatNumber(item.views)}
            </span>

            {/* Trend */}
            <span className="hidden justify-end sm:flex">
              <TrendIcon trend={item.trend} value={item.trendValue} />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
