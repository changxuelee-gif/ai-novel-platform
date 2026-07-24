"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockNovel, MockChapter } from "@/lib/mock-data";
import type { Comment } from "@/types";
import { ChapterList } from "./ChapterList";
import { AuthorCard } from "./AuthorCard";
import { RelatedNovels } from "./RelatedNovels";
import { ReviewList } from "./ReviewList";

interface NovelTabsProps {
  novel: MockNovel;
  chapters: MockChapter[];
  comments?: Comment[];
}

const tabs = ["synopsis", "chapterList", "reviewArea", "authorPage", "relatedRecommend"] as const;
type TabId = (typeof tabs)[number];

export function NovelTabs({ novel, chapters }: NovelTabsProps) {
  const t = useTranslations("novel");
  const [activeTab, setActiveTab] = useState<TabId>("synopsis");

  const latestChapters = [...chapters].sort((a, b) => b.order - a.order).slice(0, 4);

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-colors relative",
              activeTab === tab
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(tab)}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === "synopsis" && (
          <div className="space-y-4">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              {t("synopsis")}
            </h3>
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {novel.description}
            </div>
            <div className="flex flex-wrap gap-2">
              {novel.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Latest Chapters */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  {t("latestChapters")}
                </h3>
                <Link
                  href={`/novel/${novel.id}`}
                  onClick={() => setActiveTab("chapterList")}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  {t("viewAllChapters")}
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {latestChapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/novel/${novel.id}/read`}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm hover:bg-muted/50 group transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-muted-foreground shrink-0 w-8">
                        {chapter.order}.
                      </span>
                      <span className="truncate text-foreground group-hover:text-primary">
                        {chapter.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-xs text-muted-foreground">
                        {chapter.wordCount >= 10000
                          ? `${(chapter.wordCount / 10000).toFixed(1)}万`
                          : `${chapter.wordCount}`}字
                      </span>
                      {chapter.isPremium ? (
                        <Badge variant="outline" className="text-xs border-amber-500 text-amber-600">
                          <Lock className="w-3 h-3 mr-0.5" />
                          {t("premium")}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {t("free")}
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {t("publishedAt")}: {novel.createdAt}
            </div>
          </div>
        )}

        {activeTab === "chapterList" && (
          <ChapterList chapters={chapters} />
        )}

        {activeTab === "reviewArea" && (
          <ReviewList />
        )}

        {activeTab === "authorPage" && (
          <AuthorCard novel={novel} />
        )}

        {activeTab === "relatedRecommend" && (
          <RelatedNovels currentNovelId={novel.id} />
        )}
      </div>
    </div>
  );
}
