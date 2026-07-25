"use client";

import { useTranslations } from "next-intl";
import { trpc } from "@/trpc/client";

export function RecentlyRead() {
  const t = useTranslations("home");
  const { data: readingProgresses } = trpc.interaction.getReadingProgresses.useQuery();

  const recentItems = (readingProgresses ?? []).slice(0, 8).map((rp) => ({
    id: rp.novelId,
    title: rp.novel?.title ?? "",
    cover: rp.novel?.cover ?? "",
  }));

  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">
        {t("recentRead")}
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {recentItems.map((item) => (
          <div
            key={item.id}
            className="group shrink-0 cursor-pointer"
          >
            <div className="overflow-hidden rounded-md transition-transform group-hover:scale-105">
              <img
                src={item.cover}
                alt={item.title}
                className="h-20 w-16 object-cover"
              />
            </div>
          </div>
        ))}
        {recentItems.length === 0 && (
          <div className="text-xs text-muted-foreground py-4">
            {t("noData", { ns: "common" })}
          </div>
        )}
      </div>
    </section>
  );
}
