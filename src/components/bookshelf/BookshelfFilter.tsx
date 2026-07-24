"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface BookshelfFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const categories = ["all", "following", "completed", "pending"] as const;
const sortOptions = ["sortByRecent", "sortByAdded", "sortByUpdated"] as const;

export function BookshelfFilter({
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: BookshelfFilterProps) {
  const t = useTranslations("profile.bookshelfPage");

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Category Tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeCategory === cat
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(cat)}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 text-sm bg-muted rounded-lg border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {sortOptions.map((opt) => (
          <option key={opt} value={opt}>
            {t(opt)}
          </option>
        ))}
      </select>
    </div>
  );
}
