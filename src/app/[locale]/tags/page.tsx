"use client";

import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { trpc } from "@/trpc/client";
import { Tags as TagsIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function TagsPage() {
  const t = useTranslations();
  const { data: tags, isLoading } = trpc.novel.listTags.useQuery();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <TagsIcon className="w-8 h-8 text-primary" />
            {t("nav.allTags")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">浏览所有小说标签，发现更多精彩内容</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/explore?tag=${encodeURIComponent(tag.slug)}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all text-sm"
              >
                <span>{tag.name}</span>
                <span className="text-xs text-muted-foreground">({tag.novelCount})</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <TagsIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">暂无标签</h3>
            <p className="text-sm text-muted-foreground">标签数据尚未创建</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
