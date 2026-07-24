"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Star, Flame } from "lucide-react";
import type { NovelCard } from "@/types/novel";

const tagColors: Record<string, string> = {
  "狼人": "bg-red-100 text-red-700",
  "大女主": "bg-pink-100 text-pink-700",
  "悬疑": "bg-purple-100 text-purple-700",
  "冒险": "bg-blue-100 text-blue-700",
  "科幻": "bg-cyan-100 text-cyan-700",
  "漂流": "bg-teal-100 text-teal-700",
  "古言": "bg-amber-100 text-amber-700",
  "甜宠": "bg-rose-100 text-rose-700",
  "宫斗": "bg-orange-100 text-orange-700",
};

function formatPopularity(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "w";
  }
  return num.toString();
}

interface FeaturedCardProps {
  novel: NovelCard;
}

export function FeaturedCard({ novel }: FeaturedCardProps) {
  const t = useTranslations("home");

  return (
    <Link href={`/novel/${novel.id}`} className="flex gap-4 rounded-lg bg-card p-4 shadow-sm transition-shadow hover:shadow-md no-underline text-inherit">
      {/* Cover */}
      <div className="shrink-0 overflow-hidden rounded-md">
        <img
          src={novel.cover}
          alt={novel.title}
          className="h-40 w-28 object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="mb-1.5 text-base font-semibold leading-tight line-clamp-1">
          {novel.title}
        </h3>

        {/* Tags */}
        <div className="mb-2 flex flex-wrap gap-1">
          {novel.tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium ${
                tagColors[tag] || "bg-gray-100 text-gray-600"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Author */}
        <p className="mb-2 text-xs text-muted-foreground">
          {t("author")}：{novel.author}
        </p>

        {/* Rating + Popularity */}
        <div className="mb-2 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i <= Math.round(novel.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{novel.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span>{formatPopularity(novel.popularity)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {novel.description}
        </p>
      </div>
    </Link>
  );
}
