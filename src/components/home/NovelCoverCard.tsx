"use client";

import type { NovelCard } from "@/types/novel";

interface NovelCoverCardProps {
  novel: NovelCard;
}

export function NovelCoverCard({ novel }: NovelCoverCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="overflow-hidden rounded-md">
        <img
          src={novel.cover}
          alt={novel.title}
          className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p className="mt-1.5 text-xs leading-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
        {novel.title}
      </p>
    </div>
  );
}
