"use client";

import { useTranslations } from "next-intl";
import { BookOpen, FileText, Heart, Coins } from "lucide-react";
import type { EarningsData } from "@/lib/mock-data";
import { formatNumber } from "@/lib/mock-data";

interface EarningsOverviewProps {
  data: EarningsData;
}

const statCards = [
  { key: "totalReads", icon: BookOpen, labelKey: "totalReads", color: "bg-blue-500" },
  { key: "totalWords", icon: FileText, labelKey: "totalWords", color: "bg-green-500" },
  { key: "totalFavorites", icon: Heart, labelKey: "totalFavorites", color: "bg-pink-500" },
  { key: "totalCoins", icon: Coins, labelKey: "totalCoins", color: "bg-amber-500" },
];

export function EarningsOverview({ data }: EarningsOverviewProps) {
  const t = useTranslations("profile.earningsPage");

  const getValue = (key: string) => {
    switch (key) {
      case "totalReads": return formatNumber(data.totalReads);
      case "totalWords": return formatNumber(data.totalWords);
      case "totalFavorites": return formatNumber(data.totalFavorites);
      case "totalCoins": return formatNumber(data.totalCoins);
      default: return "";
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="bg-card rounded-xl border border-border/50 p-4 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-lg ${card.color}/10 flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${card.color.replace("bg-", "text-")}`} />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">{getValue(card.key)}</div>
              <div className="text-xs text-muted-foreground">{t(card.labelKey)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
