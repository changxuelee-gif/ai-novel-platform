"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { toNovelCard } from "@/lib/transformers";
import { LanguageTabs } from "./LanguageTabs";
import { GenreTabs } from "./GenreTabs";
import { NovelGrid } from "./NovelGrid";

export function NovelSection() {
  const t = useTranslations("home");
  const [activeLanguage, setActiveLanguage] = useState("zh");
  const [activeGenre, setActiveGenre] = useState("all");

  const { data, isLoading } = trpc.novel.list.useQuery({
    page: 1,
    limit: 100,
    status: "PUBLISHED",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const allNovels = useMemo(
    () => (data?.novels ?? []).map(toNovelCard),
    [data]
  );

  const filteredNovels = useMemo(() => {
    return allNovels.filter((novel) => {
      const matchGenre =
        activeGenre === "all" || novel.genre === activeGenre;
      return matchGenre;
    });
  }, [allNovels, activeGenre]);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">{t("novel")}</h2>
      </div>

      {/* Language tabs */}
      <div className="mb-2 flex items-center justify-between">
        <LanguageTabs
          active={activeLanguage}
          onChange={setActiveLanguage}
        />
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {t("filter")}
          </Button>
          <button className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {t("more")}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Genre tabs */}
      <GenreTabs active={activeGenre} onChange={setActiveGenre} />

      {/* Novel grid */}
      <div className="mt-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <NovelGrid novels={filteredNovels} />
        )}
      </div>

      {/* Load more */}
      {filteredNovels.length > 0 && !isLoading && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="sm" className="gap-1">
            {t("loadMore")}
          </Button>
        </div>
      )}

      {filteredNovels.length === 0 && !isLoading && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          {t("noData", { ns: "common" })}
        </div>
      )}
    </section>
  );
}
