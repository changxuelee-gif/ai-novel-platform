"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { RankingTabs } from "@/components/ranking/RankingTabs";
import { RankingTop3 } from "@/components/ranking/RankingTop3";
import { RankingList } from "@/components/ranking/RankingList";
import { RankingPagination } from "@/components/ranking/RankingPagination";
import { rankingTop3, rankingFullList } from "@/lib/mock-data";
import type { RankingType, RankingTimeRange } from "@/types/novel";

const PAGE_SIZE = 10;

export default function RankingPage() {
  const t = useTranslations("ranking");

  const [selectedType, setSelectedType] = useState<RankingType>("popularity");
  const [selectedTimeRange, setSelectedTimeRange] = useState<RankingTimeRange>("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const handleTypeChange = (type: RankingType) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleTimeRangeChange = (range: RankingTimeRange) => {
    setSelectedTimeRange(range);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return rankingFullList.slice(start, start + PAGE_SIZE);
  }, [currentPage]);

  const totalPages = Math.ceil(rankingFullList.length / PAGE_SIZE);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Tabs / filters */}
        <RankingTabs
          selectedType={selectedType}
          selectedTimeRange={selectedTimeRange}
          selectedCategory={selectedCategory}
          onTypeChange={handleTypeChange}
          onTimeRangeChange={handleTimeRangeChange}
          onCategoryChange={handleCategoryChange}
        />

        {/* Top 3 podium */}
        <RankingTop3 top3={rankingTop3} />

        {/* Full list section */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{t("fullList")}</h2>
            <span className="text-xs text-muted-foreground">
              {t("totalWorks", { count: rankingFullList.length })}
            </span>
          </div>

          <RankingList list={paginatedList} />

          <RankingPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </AppLayout>
  );
}
