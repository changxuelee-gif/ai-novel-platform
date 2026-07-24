"use client";

import type { NovelCard } from "@/types/novel";
import { NovelCoverCard } from "./NovelCoverCard";

interface NovelGridProps {
  novels: NovelCard[];
}

export function NovelGrid({ novels }: NovelGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
      {novels.map((novel) => (
        <NovelCoverCard key={novel.id} novel={novel} />
      ))}
    </div>
  );
}
