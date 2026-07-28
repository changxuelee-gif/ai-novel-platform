"use client";

import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { Users } from "lucide-react";

export default function CharactersPage() {
  const t = useTranslations();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            {t("nav.characters")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">探索精彩角色，发现你喜爱的人物</p>
        </div>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">角色广场</h3>
          <p className="text-sm text-muted-foreground">角色广场正在开发中，敬请期待</p>
        </div>
      </div>
    </AppLayout>
  );
}
