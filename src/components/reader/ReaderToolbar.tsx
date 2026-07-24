"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Settings } from "lucide-react";

interface ReaderToolbarProps {
  novelId: string;
  chapterOrder: number;
  totalChapters: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleSettings: () => void;
}

export function ReaderToolbar({
  novelId,
  chapterOrder,
  totalChapters,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onToggleSettings,
}: ReaderToolbarProps) {
  const t = useTranslations("novel.read");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border/50">
      <div className="flex items-center justify-between px-4 py-2.5 max-w-4xl mx-auto">
        {/* Prev Chapter */}
        <Button variant="ghost" size="sm" onClick={onPrev} disabled={!hasPrev} className="gap-1">
          <ChevronLeft className="w-4 h-4" />
          {t("prevChapter")}
        </Button>

        {/* Chapter indicator */}
        <span className="text-xs text-muted-foreground">
          {chapterOrder} / {totalChapters}
        </span>

        {/* Next Chapter */}
        <Button variant="ghost" size="sm" onClick={onNext} disabled={!hasNext} className="gap-1">
          {t("nextChapter")}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-center gap-8 pb-2.5">
        <Link href={`/novel/${novelId}`}>
          <button className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            {t("backToNovel")}
          </button>
        </Link>
        <button
          onClick={onToggleSettings}
          className="flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="w-5 h-5" />
          {t("settings")}
        </button>
      </div>
    </div>
  );
}
