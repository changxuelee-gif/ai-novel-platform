"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { featuredNovels } from "@/lib/mock-data";
import { FeaturedCard } from "./FeaturedCard";

export function FeaturedSection() {
  const t = useTranslations("home");

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">{t("featured")}</h2>
        <Link
          href="/explore"
          className="flex items-center gap-0.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("allBooks")}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featuredNovels.map((novel) => (
          <FeaturedCard key={novel.id} novel={novel} />
        ))}
      </div>
    </section>
  );
}
