"use client";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { getRelatedNovels, formatNumber } from "@/lib/mock-data";

interface RelatedNovelsProps {
  currentNovelId: string;
}

export function RelatedNovels({ currentNovelId }: RelatedNovelsProps) {
  const novels = getRelatedNovels(currentNovelId, 6);

  if (novels.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        暂无相关推荐
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {novels.map((novel) => (
        <Link
          key={novel.id}
          href={`/novel/${novel.id}`}
          className="flex gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-muted/30 transition-all group"
        >
          <img
            src={novel.cover}
            alt={novel.title}
            className="w-16 h-22 rounded-lg object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
              {novel.title}
            </h4>
            <div className="text-xs text-muted-foreground mt-1">
              {novel.author.name}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {novel.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>{formatNumber(novel.views)}阅读</span>
              <span className="flex items-center gap-0.5 text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                {novel.rating}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
