"use client";

import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { trpc } from "@/trpc/client";
import { Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";

export default function InteractiveNovelsPage() {
  const t = useTranslations();
  const { data: novelData, isLoading } = trpc.novel.list.useQuery({
    page: 1,
    limit: 20,
    status: "PUBLISHED",
  });

  // For now, show all published novels in interactive view
  const novels = novelData?.novels ?? [];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Gamepad2 className="w-8 h-8 text-primary" />
            {t("nav.interactiveNovel")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">体验互动式小说，选择你的故事走向</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : novels.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {novels.map((novel) => (
              <Link
                key={novel.id}
                href={`/novel/${novel.id}`}
                className="group rounded-xl border border-border/50 bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                  {novel.cover ? (
                    <img
                      src={novel.cover}
                      alt={novel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
                      <Gamepad2 className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px]">
                    互动
                  </Badge>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {novel.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {novel.author?.name ?? "未知作者"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Gamepad2 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">暂无互动小说</h3>
            <p className="text-sm text-muted-foreground">互动小说功能即将上线，敬请期待</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
