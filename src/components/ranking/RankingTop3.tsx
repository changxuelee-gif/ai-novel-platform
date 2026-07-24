"use client";

import { Crown, Flame } from "lucide-react";
import { formatNumber } from "@/lib/mock-data";
import type { RankingListItem } from "@/types/novel";

interface RankingTop3Props {
  top3: RankingListItem[];
}

const podiumStyles = [
  // #1 - gold
  {
    bg: "bg-gradient-to-b from-amber-50 to-yellow-100 dark:from-amber-950/40 dark:to-yellow-900/30",
    border: "border-amber-300 dark:border-amber-700",
    badge: "bg-amber-400 text-white",
    coverSize: "w-[200px] h-[280px]",
    height: "pt-0",
    order: "order-2",
  },
  // #2 - silver
  {
    bg: "bg-gradient-to-b from-gray-50 to-slate-100 dark:from-gray-900/40 dark:to-slate-800/30",
    border: "border-gray-300 dark:border-gray-600",
    badge: "bg-gray-400 text-white",
    coverSize: "w-[150px] h-[210px]",
    height: "pt-8",
    order: "order-1",
  },
  // #3 - bronze
  {
    bg: "bg-gradient-to-b from-orange-50 to-amber-100 dark:from-orange-950/40 dark:to-amber-900/30",
    border: "border-orange-300 dark:border-orange-700",
    badge: "bg-orange-400 text-white",
    coverSize: "w-[150px] h-[210px]",
    height: "pt-8",
    order: "order-3",
  },
];

export function RankingTop3({ top3 }: RankingTop3Props) {
  if (!top3 || top3.length === 0) return null;

  // Order: #2 left, #1 center, #3 right
  const displayOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const styleIndices = [1, 0, 2]; // matches display order

  return (
    <div className="flex items-end justify-center gap-4 py-6">
      {displayOrder.map((item, idx) => {
        const style = podiumStyles[styleIndices[idx]];
        const isFirst = item.rank === 1;

        return (
          <div
            key={item.id}
            className={`${style.order} flex ${style.height} flex-col items-center`}
          >
            <div
              className={`flex flex-col items-center rounded-xl border ${style.border} ${style.bg} p-4 shadow-sm`}
            >
              {/* Crown for #1 */}
              {isFirst && (
                <Crown className="mb-1 size-6 text-amber-500" />
              )}

              {/* Rank badge */}
              <div
                className={`mb-3 flex size-7 items-center justify-center rounded-full text-sm font-bold ${style.badge}`}
              >
                {item.rank}
              </div>

              {/* Cover image */}
              <div
                className={`${style.coverSize} mb-3 overflow-hidden rounded-lg shadow-md`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.cover}
                  alt={item.title}
                  className="size-full object-cover"
                />
              </div>

              {/* Title */}
              <h3 className="mb-1 max-w-[180px] truncate text-sm font-semibold text-foreground">
                {item.title}
              </h3>

              {/* Author */}
              <p className="mb-2 text-xs text-muted-foreground">{item.author}</p>

              {/* Views / heat */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Flame className="size-3.5 text-orange-500" />
                <span>{formatNumber(item.views)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
