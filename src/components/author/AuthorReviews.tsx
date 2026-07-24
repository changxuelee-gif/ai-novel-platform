"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import type { AuthorReview, RatingDistribution } from "@/types/novel";

type FilterMode = "all" | "positive" | "negative";

interface AuthorReviewsProps {
  reviews: AuthorReview[];
  ratingDistribution: RatingDistribution[];
  averageRating: number;
  totalReviews: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

export function AuthorReviews({
  reviews,
  ratingDistribution,
  averageRating,
  totalReviews,
}: AuthorReviewsProps) {
  const t = useTranslations("author");
  const [filter, setFilter] = useState<FilterMode>("all");

  const filterTabs: { key: FilterMode; label: string }[] = [
    { key: "all", label: t("all") },
    { key: "positive", label: t("positive") },
    { key: "negative", label: t("negative") },
  ];

  const filteredReviews = reviews.filter((r) => {
    if (filter === "positive") return r.rating >= 4;
    if (filter === "negative") return r.rating <= 2;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("readerReviews")}</h2>
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                filter === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Rating statistics */}
        <div className="lg:w-64 shrink-0 rounded-xl border bg-card p-5">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-foreground">
              {averageRating}
            </div>
            <StarRating rating={Math.round(averageRating)} />
            <p className="text-sm text-muted-foreground mt-1">
              {totalReviews} {t("reviews")}
            </p>
          </div>

          <div className="space-y-2">
            {ratingDistribution.map((dist) => (
              <div key={dist.star} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-6 text-right">
                  {dist.star}★
                </span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {dist.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Review list */}
        <div className="flex-1 space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border bg-card p-4 space-y-3"
            >
              {/* User row */}
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={review.userAvatar} alt={review.userName} />
                  <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{review.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.createdAt}
                  </p>
                </div>
                <StarRating rating={review.rating} />
              </div>

              {/* Review content */}
              <p className="text-sm leading-relaxed">{review.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-1">
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="size-3.5" />
                  <span>
                    {review.likes} {t("likes")}
                  </span>
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="size-3.5" />
                  <span>{t("reply")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
