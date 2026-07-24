"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { genreTabs } from "@/lib/mock-data";

interface GenreTabsProps {
  active: string;
  onChange: (key: string) => void;
}

export function GenreTabs({ active, onChange }: GenreTabsProps) {
  const t = useTranslations("home");

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
      {genreTabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "shrink-0 rounded-md border px-3 py-1 text-xs font-medium transition-colors",
            active === tab.key
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
          )}
        >
          {tab.key === "all" ? t("all") : t(`genres.${tab.key}`)}
        </button>
      ))}
    </div>
  );
}
