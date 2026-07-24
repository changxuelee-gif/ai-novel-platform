"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight, BookOpen } from "lucide-react";
import { mockBookshelf } from "@/lib/mock-data";

interface ProfileBookshelfProps {
  showHeader?: boolean;
}

export function ProfileBookshelf({ showHeader = true }: ProfileBookshelfProps) {
  const t = useTranslations("profile.page");

  return (
    <div className="mb-8">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            {t("myBookshelf")}
          </h2>
          <Link href="/profile/bookshelf" className="text-sm text-primary hover:underline flex items-center gap-1">
            {t("viewMore")}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {mockBookshelf.slice(0, 5).map((item) => (
          <Link key={item.novelId} href={`/novel/${item.novelId}`} className="shrink-0 w-28 group">
            <div className="relative rounded-lg overflow-hidden aspect-[3/4] mb-2">
              <img
                src={item.cover}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
              </div>
              {item.category === "completed" && (
                <div className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded">
                  {t("statusCompleted")}
                </div>
              )}
            </div>
            <div className="text-xs font-medium text-foreground truncate group-hover:text-primary">
              {item.title}
            </div>
            <div className="text-[10px] text-muted-foreground">
              第{item.lastReadChapter.replace("第", "").replace("章", "")}章 · {item.progress}%
            </div>
          </Link>
        ))}

        <Link href="/" className="shrink-0 w-28 group">
          <div className="rounded-lg border-2 border-dashed border-border/50 aspect-[3/4] flex flex-col items-center justify-center mb-2 hover:border-primary/50 transition-colors">
            <BookOpen className="w-6 h-6 text-muted-foreground mb-1" />
            <span className="text-[10px] text-muted-foreground">{t("myBookshelf")}</span>
          </div>
          <div className="text-xs text-muted-foreground text-center">{t("viewMore")}</div>
        </Link>
      </div>
    </div>
  );
}
