"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type TabType = "bookshelf" | "works" | "activity";

interface ProfileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const t = useTranslations();

  const tabs: { key: TabType; label: string }[] = [
    { key: "bookshelf", label: t("profile.page.myBookshelfTab") },
    { key: "works", label: t("profile.page.myWorksTab") },
    { key: "activity", label: t("profile.page.activityTab") },
  ];

  return (
    <div className="flex gap-1 p-1 bg-muted/30 rounded-lg mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={cn(
            "flex-1 px-6 py-2.5 rounded-md text-sm font-medium transition-all",
            activeTab === tab.key
              ? "bg-card text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
