"use client";

import { useTranslations } from "next-intl";
import { recentReads } from "@/lib/mock-data";

export function RecentlyRead() {
  const t = useTranslations("home");

  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-muted-foreground">
        {t("recentRead")}
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {recentReads.map((item) => (
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
      </div>
    </section>
  );
}
