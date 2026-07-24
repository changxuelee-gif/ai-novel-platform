"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { languageTabs } from "@/lib/mock-data";

interface LanguageTabsProps {
  active: string;
  onChange: (key: string) => void;
}

export function LanguageTabs({ active, onChange }: LanguageTabsProps) {
  const t = useTranslations("home");

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {languageTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
              active === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab.key === "all" ? t("all") : t(`languages.${tab.key}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
