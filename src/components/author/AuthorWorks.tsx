"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star, Flame, BookOpen, Type, Play, BookmarkPlus } from "lucide-react";
import type { AuthorWork } from "@/types/novel";

type SortMode = "hottest" | "newest" | "rating";

interface AuthorWorksProps {
  works: AuthorWork[];
  sortMode?: SortMode;
  onSortChange?: (mode: SortMode) => void;
}

const TAG_COLORS: Record<string, string> = {
  "悬疑": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "科幻": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "冒险": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "战争": "bg-red-500/10 text-red-400 border-red-500/20",
};

const DEFAULT_TAG = "bg-slate-500/10 text-slate-400 border-slate-500/20";

function getTagColor(tag: string) {
  return TAG_COLORS[tag] ?? DEFAULT_TAG;
}

function StatusBadge({ status }: { status: AuthorWork["status"] }) {
  const t = useTranslations("author");
  if (status === "ongoing") {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
        {t("verified") ? "连载中" : "连载中"}
      </Badge>
    );
  }
  if (status === "completed") {
    return (
      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
        已完结
      </Badge>
    );
  }
  return null;
}

export function AuthorWorks({
  works,
  sortMode: controlledSort,
  onSortChange,
}: AuthorWorksProps) {
  const t = useTranslations("author");
  const [internalSort, setInternalSort] = useState<SortMode>("hottest");
  const sortMode = controlledSort ?? internalSort;
  const handleSortChange = onSortChange ?? setInternalSort;

  const tabs: { key: SortMode; label: string }[] = [
    { key: "hottest", label: t("hottest") },
    { key: "newest", label: t("newest") },
    { key: "rating", label: t("byRating") },
  ];

  const sorted = [...works].sort((a, b) => {
    if (sortMode === "rating") return b.rating - a.rating;
    if (sortMode === "newest") return b.chapterCount - a.chapterCount;
    // hottest - parse heat string
    const parseHeat = (h: string) => {
      const num = parseFloat(h.replace(/[^0-9.]/g, ""));
      if (h.includes("w") || h.includes("万")) return num * 10000;
      return num;
    };
    return parseHeat(b.heat) - parseHeat(a.heat);
  });

  const featured = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div className="space-y-6">
      {/* Sort tabs */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("allWorks")}</h2>
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleSortChange(tab.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                sortMode === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured work */}
      {featured && (
        <div className="flex flex-col sm:flex-row gap-6 rounded-xl border bg-card p-4 sm:p-6">
          {/* Cover */}
          <div className="shrink-0">
            <div className="relative w-full sm:w-40 aspect-[3/4] overflow-hidden rounded-lg">
              <img
                src={featured.cover}
                alt={featured.title}
                className="size-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <StatusBadge status={featured.status} />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 flex flex-col">
            <h3 className="text-xl font-bold mb-2">{featured.title}</h3>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {featured.tags.map((tag) => (
                <Badge
                  key={tag}
                  className={cn("text-xs border", getTagColor(tag))}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Star className="size-3.5 text-amber-400" />
                <span className="font-medium text-foreground">
                  {featured.rating}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <Flame className="size-3.5 text-orange-400" />
                {featured.heat}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="size-3.5" />
                {t("chapters", { count: featured.chapterCount })}
              </span>
              <span className="flex items-center gap-1">
                <Type className="size-3.5" />
                {featured.wordCount}
              </span>
            </div>

            {/* Description */}
            {featured.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {featured.description}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-auto">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Play className="size-4" />
                {t("readNow")}
              </Button>
              <Button variant="outline">
                <BookmarkPlus className="size-4" />
                {t("addToBookshelf")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Remaining works grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rest.map((work) => (
            <div
              key={work.id}
              className="flex gap-4 rounded-xl border bg-card p-4"
            >
              <div className="relative shrink-0 w-20 aspect-[3/4] overflow-hidden rounded-lg">
                <img
                  src={work.cover}
                  alt={work.title}
                  className="size-full object-cover"
                />
                <div className="absolute top-1 left-1">
                  <StatusBadge status={work.status} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1.5 truncate">
                  {work.title}
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {work.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className={cn("text-[10px] border", getTagColor(tag))}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="size-3 text-amber-400" />
                    <span className="font-medium text-foreground">
                      {work.rating}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="size-3" />
                    {t("chapters", { count: work.chapterCount })}
                  </span>
                  <span>{work.wordCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
