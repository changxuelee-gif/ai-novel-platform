"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type MessageTabType = "system" | "comment" | "like";

interface MessageTabsProps {
  activeTab: MessageTabType;
  onTabChange: (tab: MessageTabType) => void;
  counts: Record<MessageTabType, number>;
}

export function MessageTabs({ activeTab, onTabChange, counts }: MessageTabsProps) {
  const t = useTranslations("profile.messagesPage");

  const tabs: { key: MessageTabType; label: string }[] = [
    { key: "system", label: t("systemMessages") },
    { key: "comment", label: t("comments") },
    { key: "like", label: t("likesAndFavorites") },
  ];

  return (
    <div className="flex border-b border-border mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={cn(
            "relative px-6 py-3 text-sm font-medium transition-colors",
            activeTab === tab.key
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
          {counts[tab.key] > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {counts[tab.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
