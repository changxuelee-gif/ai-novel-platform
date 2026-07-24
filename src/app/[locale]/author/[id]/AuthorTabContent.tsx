"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AuthorWorks } from "@/components/author/AuthorWorks";
import { AuthorFeed } from "@/components/author/AuthorFeed";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Calendar, BookOpen } from "lucide-react";
import type { AuthorWork, AuthorFeedItem } from "@/types/novel";

type TabKey = "works" | "feed" | "profile";

interface AuthorTabContentProps {
  works: AuthorWork[];
  feeds: AuthorFeedItem[];
  authorBio: string;
  authorName: string;
  authorAvatar: string;
}

export function AuthorTabContent({
  works,
  feeds,
  authorBio,
  authorName,
  authorAvatar,
}: AuthorTabContentProps) {
  const t = useTranslations("author");
  const [activeTab, setActiveTab] = useState<TabKey>("works");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "works", label: t("works") },
    { key: "feed", label: t("feed") },
    { key: "profile", label: t("profile") },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "relative px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "text-blue-600"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pt-6">
        {activeTab === "works" && <AuthorWorks works={works} />}
        {activeTab === "feed" && <AuthorFeed items={feeds} />}
        {activeTab === "profile" && (
          <div className="rounded-xl border bg-card p-6 space-y-6">
            <h3 className="text-lg font-semibold">{t("profileIntro")}</h3>

            <div className="flex items-start gap-4">
              <Avatar className="size-16">
                <AvatarImage src={authorAvatar} alt={authorName} />
                <AvatarFallback className="text-xl">
                  {authorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="text-base font-semibold mb-1">{authorName}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {authorBio}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <BookOpen className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("worksCount")}
                  </p>
                  <p className="text-sm font-medium">{works.length} 部</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("joinDate")}
                  </p>
                  <p className="text-sm font-medium">2025-01</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
