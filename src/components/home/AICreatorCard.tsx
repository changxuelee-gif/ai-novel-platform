"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Sparkles } from "lucide-react";

export function AICreatorCard() {
  const t = useTranslations("home");

  return (
    <div className="overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-4 text-white">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold">{t("aiCreator")}</h3>
          <p className="text-[11px] text-white/70">{t("aiCreatorSubtitle")}</p>
        </div>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-white/70">
        {t("aiCreatorDesc")}
      </p>
      <Link href="/create">
        <button className="rounded-lg bg-white px-4 py-1.5 text-xs font-medium text-purple-600 transition-colors hover:bg-white/90">
          {t("enterCreation")}
        </button>
      </Link>
    </div>
  );
}
