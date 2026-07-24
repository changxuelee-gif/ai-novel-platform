"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Check, BookOpen } from "lucide-react";
import type { MockNovel } from "@/lib/mock-data";
import { mockNovels, formatNumber } from "@/lib/mock-data";

interface AuthorCardProps {
  novel: MockNovel;
}

export function AuthorCard({ novel }: AuthorCardProps) {
  const t = useTranslations("novel");

  const authorNovels = mockNovels.filter(
    (n) => n.author.id === novel.author.id && n.id !== novel.id
  );

  return (
    <div className="space-y-6">
      {/* Author Info */}
      <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
        <Avatar className="w-16 h-16">
          <img src={novel.author.avatar} alt={novel.author.name} />
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{novel.author.name}</h3>
            {novel.author.verified && (
              <Check className="w-4 h-4 text-blue-500 fill-blue-500" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            热爱玄幻创作，擅长构建宏大世界观。代表作《星辰变之万界天尊》持续热销中。
          </p>
          <div className="flex gap-4 mb-3 text-sm">
            <div className="text-center">
              <div className="font-bold text-foreground">{authorNovels.length + 1}</div>
              <div className="text-xs text-muted-foreground">作品</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-foreground">
                {formatNumber(novel.views + authorNovels.reduce((s, n) => s + n.views, 0))}
              </div>
              <div className="text-xs text-muted-foreground">总阅读</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-foreground">{novel.rating}</div>
              <div className="text-xs text-muted-foreground">评分</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              {t("follow")}
            </Button>
            <Button size="sm">{t("visitPage")}</Button>
          </div>
        </div>
      </div>

      {/* Other Works */}
      {authorNovels.length > 0 && (
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t("otherWorks")}
          </h4>
          <div className="space-y-3">
            {authorNovels.map((n) => (
              <div
                key={n.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <img
                  src={n.cover}
                  alt={n.title}
                  className="w-10 h-14 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{n.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatNumber(n.views)}阅读 · {n.chapterCount}章
                  </div>
                </div>
                <div className="text-sm font-medium text-amber-500">{n.rating}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
