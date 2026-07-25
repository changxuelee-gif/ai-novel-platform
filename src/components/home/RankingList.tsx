"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { toRankingItem } from "@/lib/transformers";

const rankTabs = [
  { key: "popularity", labelKey: "home.popularityRank", sortBy: "views" },
  { key: "newbook", labelKey: "home.newBookRank", sortBy: "createdAt" },
  { key: "completed", labelKey: "home.completedRank", sortBy: "views", status: "ARCHIVED" as const },
] as const;

function formatPopularity(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "w";
  }
  return num.toString();
}

export function RankingList() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("popularity");

  const currentTab = rankTabs.find((tab) => tab.key === activeTab) ?? rankTabs[0];

  const { data, isLoading } = trpc.novel.list.useQuery({
    page: 1,
    limit: 5,
    status: "status" in currentTab ? currentTab.status : undefined,
    sortBy: currentTab.sortBy,
    sortOrder: "desc",
  });

  const rankingItems = (data?.novels ?? []).map(toRankingItem);

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t("home.ranking")}</h3>
        <Link
          href="/ranking"
          className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("home.more")}
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Sub tabs */}
      <div className="mb-3 flex gap-3 border-b pb-2">
        {rankTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "text-xs font-medium transition-colors pb-0.5",
              activeTab === tab.key
                ? "text-primary border-b-2 border-primary -mb-[9px]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Ranking list */}
      <div className="space-y-2.5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="h-5 w-5 animate-pulse rounded bg-muted" />
              <div className="h-3 flex-1 animate-pulse rounded bg-muted" />
              <div className="h-3 w-8 animate-pulse rounded bg-muted" />
            </div>
          ))
        ) : (
          rankingItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold",
                  index < 3
                    ? "bg-orange-500 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
              <span className="flex-1 truncate text-xs font-medium">
                {item.title}
              </span>
              <span className="text-[10px] text-muted-foreground shrink-0">
                {formatPopularity(item.views)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
