"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { trpc } from "@/trpc/client";
import { FeaturedCard } from "./FeaturedCard";
import { toNovelCard } from "@/lib/transformers";

export function FeaturedSection() {
  const t = useTranslations("home");
  const { data, isLoading } = trpc.novel.list.useQuery({
    page: 1,
    limit: 3,
    status: "PUBLISHED",
    sortBy: "views",
    sortOrder: "desc",
  });

  const novels = (data?.novels ?? []).map(toNovelCard);

  if (isLoading) {
    return (
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{t("featured")}</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </section>
    );
  }

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
        {novels.map((novel) => (
          <FeaturedCard key={novel.id} novel={novel} />
        ))}
      </div>
    </section>
  );
}
