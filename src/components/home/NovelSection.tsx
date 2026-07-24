"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { novelCards } from "@/lib/mock-data";
import { LanguageTabs } from "./LanguageTabs";
import { GenreTabs } from "./GenreTabs";
import { NovelGrid } from "./NovelGrid";

export function NovelSection() {
  const t = useTranslations("home");
  const [activeLanguage, setActiveLanguage] = useState("zh");
  const [activeGenre, setActiveGenre] = useState("mystery");

  const filteredNovels = useMemo(() => {
    return novelCards.filter((novel) => {
      const matchLang =
        activeLanguage === "all" || novel.language === activeLanguage;
      const matchGenre =
        activeGenre === "all" || novel.genre === activeGenre;
      return matchLang && matchGenre;
    });
  }, [activeLanguage, activeGenre]);

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
        <NovelGrid novels={filteredNovels} />
      </div>

      {/* Load more */}
      {filteredNovels.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="sm" className="gap-1">
            {t("loadMore")}
          </Button>
        </div>
      )}

      {filteredNovels.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          {t("noData", { ns: "common" })}
        </div>
      )}
    </section>
  );
}
