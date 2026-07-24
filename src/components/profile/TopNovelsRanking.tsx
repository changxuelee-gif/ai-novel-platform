"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Eye, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TopNovel } from "@/lib/mock-data";
import { formatNumber } from "@/lib/mock-data";

interface TopNovelsRankingProps {
  novels: TopNovel[];
}

const rankStyles = {
  1: "bg-amber-500 text-white",
  2: "bg-gray-400 text-white",
  3: "bg-amber-600 text-white",
};

export function TopNovelsRanking({ novels }: TopNovelsRankingProps) {
  const t = useTranslations("profile.earningsPage");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          {t("topNovels")}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{t("topNovelsSubtitle")}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {novels.map((novel) => (
            <div
              key={novel.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  rankStyles[novel.rank as keyof typeof rankStyles] || "bg-muted text-muted-foreground"
                )}
              >
                {novel.rank}
              </div>

              <img
                src={novel.cover}
                alt={novel.title}
                className="w-12 h-16 rounded-lg object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">{novel.title}</h4>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    {formatNumber(novel.reads)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-amber-500">
                    <Coins className="w-3 h-3" />
                    {formatNumber(novel.income)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
