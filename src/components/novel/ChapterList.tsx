"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockChapter } from "@/lib/mock-data";

interface ChapterListProps {
  chapters: MockChapter[];
}

export function ChapterList({ chapters }: ChapterListProps) {
  const t = useTranslations("novel");
  const [ascending, setAscending] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const sorted = [...chapters].sort((a, b) =>
    ascending ? a.order - b.order : b.order - a.order
  );

  const displayChapters = showAll ? sorted : sorted.slice(0, 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          共 {chapters.length} 章
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAscending(!ascending)}
          className="gap-1"
        >
          <ArrowUpDown className="w-4 h-4" />
          {ascending ? t("ascending") : t("descending")}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {displayChapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/novel/${chapter.novelId}/read`}
            className={cn(
              "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
              "hover:bg-muted/50 group"
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-muted-foreground shrink-0 w-8">
                {chapter.order}.
              </span>
              <span className="truncate text-foreground group-hover:text-primary">
                {chapter.title}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-xs text-muted-foreground">
                {chapter.wordCount >= 10000
                  ? `${(chapter.wordCount / 10000).toFixed(1)}万`
                  : `${chapter.wordCount}`}字
              </span>
              {chapter.isPremium ? (
                <Badge variant="outline" className="text-xs border-amber-500 text-amber-600">
                  <Lock className="w-3 h-3 mr-0.5" />
                  {t("premium")}
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  {t("free")}
                </Badge>
              )}
            </div>
          </Link>
        ))}
      </div>

      {chapters.length > 20 && !showAll && (
        <div className="text-center mt-4">
          <Button variant="outline" onClick={() => setShowAll(true)}>
            {t("showAll")} ({chapters.length - 20})
          </Button>
        </div>
      )}
    </div>
  );
}
