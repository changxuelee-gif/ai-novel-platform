"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { BookOpen, Trash2, Clock } from "lucide-react";
import { trpc } from "@/trpc/client";

interface HistoryItem {
  id: string;
  novelId: string;
  novelTitle: string;
  novelCover: string;
  chapterId: string;
  chapterOrder: number;
  chapterTitle: string;
  readAt: string;
}

const defaultUser = {
  id: "",
  name: "用户",
  avatar: "",
  vip: false,
  bio: "",
  following: 0,
  followers: 0,
  works: 0,
  banner: "",
};

export default function HistoryPage() {
  const t = useTranslations("profile.historyPage");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const { data: userData } = trpc.user.getProfile.useQuery();
  const { data: readingProgresses, isLoading } = trpc.interaction.getReadingProgresses.useQuery();

  const user = userData
    ? {
        ...defaultUser,
        id: userData.id,
        name: userData.name ?? "用户",
        avatar: userData.avatar ?? userData.image ?? "",
        vip: userData.role === "VERIFIED" || userData.role === "AUTHOR",
        bio: userData.bio ?? "",
        following: userData._count?.following ?? 0,
        followers: userData._count?.followers ?? 0,
        works: userData._count?.novels ?? 0,
      }
    : defaultUser;

  const assets = {
    coins: userData?.coins ?? 0,
    membershipExpiry: "",
  };

  useEffect(() => {
    if (readingProgresses) {
      const items: HistoryItem[] = readingProgresses.map((rp) => ({
        id: rp.id,
        novelId: rp.novelId,
        novelTitle: rp.novel?.title ?? "Unknown",
        novelCover: rp.novel?.cover ?? "",
        chapterId: rp.chapterId,
        chapterOrder: rp.chapterOrder,
        chapterTitle: rp.chapter?.title ?? "",
        readAt: rp.updatedAt.toISOString().split("T")[0],
      }));
      setHistory(items);
    }
  }, [readingProgresses]);

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const handleClearAll = () => {
    setHistory([]);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <ProfileSidebar user={user} assets={assets} />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {t("title")}
              </h1>
              {history.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  {t("clearAll")}
                </Button>
              )}
            </div>

            {/* History List */}
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/20 transition-all group"
                  >
                    {/* Cover */}
                    <Link href={`/novel/${item.novelId}`}>
                      <img
                        src={item.novelCover}
                        alt={item.novelTitle}
                        className="w-14 h-20 rounded-lg object-cover shrink-0 hover:opacity-80 transition-opacity"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/novel/${item.novelId}`}>
                        <h3 className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate">
                          {item.novelTitle}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {t("readTo", { order: item.chapterOrder })} · {item.chapterTitle}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.readAt}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/novel/${item.novelId}/read`}>
                        <Button size="sm">{t("continueReading")}</Button>
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Clock className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {t("emptyTitle")}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {t("emptyDesc")}
                </p>
                <Link href="/">
                  <Button>{t("goRead")}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
