"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, BookOpen, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { MockNovel } from "@/lib/mock-data";
import { mockNovels, formatNumber } from "@/lib/mock-data";

interface NovelSidebarProps {
  novel: MockNovel;
}

export function NovelSidebar({ novel }: NovelSidebarProps) {
  const t = useTranslations("novel");

  const authorNovels = mockNovels.filter(
    (n) => n.author.id === novel.author.id && n.id !== novel.id
  );

  const relatedNovels = mockNovels
    .filter((n) => n.id !== novel.id && n.category === novel.category)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Author Card */}
      <div className="bg-card rounded-xl border border-border/50 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-12 h-12">
            <img src={novel.author.avatar} alt={novel.author.name} />
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm">{novel.author.name}</span>
              {novel.author.verified && (
                <Check className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              签约作者 · 玄幻大神
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          热爱玄幻创作，擅长构建宏大世界观。代表作《星辰变之万界天尊》持续热销中。
        </p>
        <div className="flex gap-4 mb-3 text-center">
          <div>
            <div className="text-sm font-bold">{authorNovels.length + 1}</div>
            <div className="text-[10px] text-muted-foreground">作品</div>
          </div>
          <div>
            <div className="text-sm font-bold">12.8万</div>
            <div className="text-[10px] text-muted-foreground">粉丝</div>
          </div>
          <div>
            <div className="text-sm font-bold">{novel.rating}</div>
            <div className="text-[10px] text-muted-foreground">评分</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            {t("follow")}
          </Button>
          <Button size="sm" className="flex-1 text-xs">
            {t("visitPage")}
          </Button>
        </div>
      </div>

      {/* Author Other Works */}
      {authorNovels.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t("otherWorks")}
          </h4>
          <div className="space-y-2">
            {authorNovels.map((n) => (
              <Link
                key={n.id}
                href={`/novel/${n.id}`}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <img
                  src={n.cover}
                  alt={n.title}
                  className="w-8 h-11 rounded object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate group-hover:text-primary">
                    {n.title}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {formatNumber(n.views)}阅读
                  </div>
                </div>
                <span className="text-xs text-amber-500 font-medium">{n.rating}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Novels */}
      {relatedNovels.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" />
            {t("relatedRecommend")}
          </h4>
          <div className="space-y-2">
            {relatedNovels.map((n) => (
              <Link
                key={n.id}
                href={`/novel/${n.id}`}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <img
                  src={n.cover}
                  alt={n.title}
                  className="w-8 h-11 rounded object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate group-hover:text-primary">
                    {n.title}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {n.author.name} · {formatNumber(n.views)}阅读
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px] h-4 px-1">
                  {n.category}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
