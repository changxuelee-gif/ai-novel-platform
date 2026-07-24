"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle, Share2, BookOpen, Type, Clock } from "lucide-react";
import type { AuthorFeedItem } from "@/types/novel";

interface AuthorFeedProps {
  items: AuthorFeedItem[];
}

export function AuthorFeed({ items }: AuthorFeedProps) {
  const t = useTranslations("author");

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("authorFeed")}</h2>
        <button className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
          {t("viewAll")} &gt;
        </button>
      </div>

      {/* Feed items */}
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border bg-card p-4 sm:p-5 space-y-3"
        >
          {/* Author row */}
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src={item.authorAvatar} alt={item.authorName} />
              <AvatarFallback>{item.authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium">{item.authorName}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {item.createdAt}
            </span>
          </div>

          {/* Content */}
          <p className="text-sm leading-relaxed">{item.content}</p>

          {/* Related work card */}
          {item.relatedWork && (
            <div className="flex gap-3 rounded-lg border bg-muted/30 p-3">
              <div className="shrink-0 w-16 aspect-[3/4] overflow-hidden rounded-md">
                <img
                  src={item.relatedWork.cover}
                  alt={item.relatedWork.title}
                  className="size-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.relatedWork.title}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="size-3" />
                    {item.relatedWork.chapterTitle}
                  </span>
                  <span className="flex items-center gap-1">
                    <Type className="size-3" />
                    {item.relatedWork.wordCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {item.relatedWork.updatedAt}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action row */}
          <div className="flex items-center gap-4 pt-1">
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ThumbsUp className="size-3.5" />
              <span>{item.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="size-3.5" />
              <span>{item.comments}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
              <Share2 className="size-3.5" />
              <span>{t("share_btn")}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
