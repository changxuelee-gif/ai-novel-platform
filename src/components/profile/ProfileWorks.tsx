"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ChevronRight, Eye, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserWork } from "@/lib/mock-data";
import { mockUserWorks, formatNumber } from "@/lib/mock-data";

const statusConfig: Record<string, { label: string; color: string }> = {
  ongoing: { label: "statusOngoing", color: "bg-green-500/10 text-green-600" },
  completed: { label: "statusCompleted", color: "bg-blue-500/10 text-blue-600" },
  draft: { label: "statusDraft", color: "bg-gray-500/10 text-gray-600" },
};

interface ProfileWorksProps {
  showHeader?: boolean;
}

export function ProfileWorks({ showHeader = true }: ProfileWorksProps) {
  const t = useTranslations("profile.page");

  return (
    <div className="mb-8">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {t("myWorks")}
          </h2>
          <div className="flex items-center gap-2">
            <Link href="/profile/works" className="text-sm text-primary hover:underline flex items-center gap-1">
              {t("manageWorks")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {mockUserWorks.map((work: UserWork) => {
          const status = statusConfig[work.status];
          return (
            <div key={work.id} className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 hover:border-primary/20 transition-all">
              <img src={work.cover} alt={work.title} className="w-14 h-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-foreground truncate">{work.title}</h3>
                  <Badge className={cn("text-[10px] h-4 px-1.5", status.color)}>
                    {t(status.label)}
                  </Badge>
                  {work.activityTag && (
                    <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-primary/30 text-primary">
                      {work.activityTag}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mb-1.5">
                  {formatNumber(work.wordCount)}{t("words")} · {work.chapterCount}{t("chapters")} · {work.updatedAt}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(work.views)}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(work.favorites)}</span>
                  {work.rating > 0 && (
                    <span className="flex items-center gap-1 text-amber-500"><Star className="w-3 h-3 fill-current" />{work.rating}</span>
                  )}
                </div>
              </div>
              <Button size="sm" variant="outline" className="shrink-0">{t("continueCreate")}</Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
