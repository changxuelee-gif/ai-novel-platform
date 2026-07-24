"use client";

import { useTranslations } from "next-intl";
import { BookOpen, PenTool, Users, DollarSign, TrendingUp } from "lucide-react";
import type { DataOverview as DataOverviewType } from "@/lib/mock-data";
import { formatNumber } from "@/lib/mock-data";

interface DataOverviewProps {
  data: DataOverviewType;
}

const stats = [
  { key: "booksRead", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
  { key: "wordsWritten", icon: PenTool, color: "text-purple-500", bg: "bg-purple-500/10" },
  { key: "followers", icon: Users, color: "text-pink-500", bg: "bg-pink-500/10" },
  { key: "earnings", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" },
] as const;

export function DataOverview({ data }: DataOverviewProps) {
  const t = useTranslations("profile.page");

  const valueMap: Record<string, string> = {
    booksRead: data.booksRead.toString(),
    wordsWritten: formatNumber(data.wordsWritten),
    followers: data.followers.toString(),
    earnings: `¥${data.earnings.toLocaleString()}`,
  };

  const changeMap: Record<string, number> = {
    booksRead: data.booksReadChange,
    wordsWritten: data.wordsWrittenChange,
    followers: data.followersChange,
    earnings: data.earningsChange,
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        {t("dataOverview")}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.key} className="bg-card rounded-xl border border-border/50 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs text-green-500 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                {changeMap[stat.key]}%
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground">{valueMap[stat.key]}</div>
            <div className="text-xs text-muted-foreground mt-1">{t(stat.key)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
