"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { mockReadingHistory } from "@/lib/mock-data";
import { BookOpen, Trash2, Clock } from "lucide-react";

export default function HistoryPage() {
  const t = useTranslations("profile.historyPage");
  const [history, setHistory] = useState(mockReadingHistory);

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const handleClearAll = () => {
    setHistory([]);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          {history.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              <Trash2 className="w-4 h-4 mr-1" />
              {t("clearAll")}
            </Button>
          )}
        </div>

        {/* History List */}
        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 hover:border-primary/20 transition-all group"
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
                    {t("readTo", { order: item.chapterOrder})} · {item.chapterTitle}
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
    </AppLayout>
  );
}
