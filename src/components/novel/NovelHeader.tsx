"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  BookOpen,
  Heart,
  FileText,
  Type,
  Star,
  Crown,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { useState } from "react";
import type { MockNovel } from "@/lib/mock-data";
import { formatNumber } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface NovelHeaderProps {
  novel: MockNovel;
}

export function NovelHeader({ novel }: NovelHeaderProps) {
  const t = useTranslations("novel");
  const [expanded, setExpanded] = useState(false);

  const statusLabel =
    novel.status === "ongoing"
      ? t("ongoing")
      : novel.status === "completed"
        ? t("completed")
        : t("hiatus");

  const statusColor =
    novel.status === "ongoing"
      ? "bg-green-500/10 text-green-600 dark:text-green-400"
      : novel.status === "completed"
        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
        : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";

  const shortDesc = novel.description.slice(0, 120);

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      {/* Cover */}
      <div className="relative shrink-0 mx-auto md:mx-0">
        <div className="w-48 md:w-56 rounded-xl overflow-hidden shadow-lg">
          <img
            src={novel.cover}
            alt={novel.title}
            className="w-full h-auto object-cover aspect-[3/4]"
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          {novel.rating}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3 mb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {novel.title}
          </h1>
          <Badge className={cn("shrink-0", statusColor)}>{statusLabel}</Badge>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="w-6 h-6">
            <img src={novel.author.avatar} alt={novel.author.name} />
          </Avatar>
          <span className="text-sm text-muted-foreground">{novel.author.name}</span>
          {novel.author.verified && (
            <Check className="w-4 h-4 text-blue-500 fill-blue-500" />
          )}
          <span className="text-xs text-muted-foreground">
            {t("updatedAt")}: {novel.updatedAt}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">{novel.category}</Badge>
          {novel.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-2 mb-4 bg-muted/30 rounded-lg p-3">
          {[
            { icon: BookOpen, label: t("views"), value: formatNumber(novel.views) },
            { icon: Heart, label: t("favorites"), value: formatNumber(novel.favorites) },
            { icon: FileText, label: t("chapters_count"), value: novel.chapterCount.toString() },
            { icon: Type, label: t("words"), value: formatNumber(novel.wordCount) },
            { icon: Star, label: t("rating"), value: novel.rating.toString() },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <stat.icon className="w-3 h-3" />
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Link href={`/novel/${novel.id}/read`}>
            <Button size="lg" className="gap-2">
              <BookOpen className="w-4 h-4" />
              {t("readNow")}
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="gap-2">
            <Heart className="w-4 h-4" />
            {t("addToBookshelf")}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
          >
            <Crown className="w-4 h-4" />
            {t("openVip")}
          </Button>
        </div>

        {/* Description */}
        <div className="text-sm text-muted-foreground leading-relaxed">
          {expanded ? novel.description : shortDesc}
          {!expanded && novel.description.length > 120 && (
            <span>...</span>
          )}
        </div>
        {novel.description.length > 120 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-primary mt-1 flex items-center gap-1 hover:underline"
          >
            {expanded ? (
              <>
                {t("collapse")}
                <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                {t("expandMore")}
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
