"use client";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BookshelfItem } from "@/types";

interface BookshelfCardProps {
  item: BookshelfItem;
}

const categoryColors: Record<string, string> = {
  following: "bg-green-500/10 text-green-600 dark:text-green-400",
  completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
};

export function BookshelfCard({ item }: BookshelfCardProps) {
  return (
    <Link
      href={`/novel/${item.novelId}`}
      className="group block"
    >
      <div className="relative rounded-xl overflow-hidden bg-muted/30 border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg">
        {/* Cover */}
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={item.cover}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 right-2">
          <Badge
            className={cn("text-[10px]", categoryColors[item.category] || "")}
          >
            {item.category === "following"
              ? "追更"
              : item.category === "completed"
                ? "完结"
                : "待读"}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${item.progress}%` }}
          />
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-medium truncate text-foreground group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {item.author}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">
              {item.progress}%
            </span>
            <span className="text-[10px] text-muted-foreground truncate ml-2">
              {item.lastReadChapter}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
