"use client";

import { cn } from "@/lib/utils";

interface Category {
  key: string;
  label: string;
}

interface ActivityCategoryTabsProps {
  categories: readonly Category[];
  selected: string;
  onCategoryChange: (key: string) => void;
}

export function ActivityCategoryTabs({
  categories,
  selected,
  onCategoryChange,
}: ActivityCategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onCategoryChange(cat.key)}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            selected === cat.key
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
