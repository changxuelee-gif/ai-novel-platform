"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockChapter, MockNovel } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

interface ChapterNavProps {
  novel: MockNovel;
  chapters: MockChapter[];
  currentChapterId: string;
  onSelect: (chapterId: string) => void;
}

export function ChapterNav({ novel, chapters, currentChapterId, onSelect }: ChapterNavProps) {
  const [search, setSearch] = useState("");

  const filtered = chapters.filter(
    (ch) =>
      ch.title.toLowerCase().includes(search.toLowerCase()) ||
      ch.order.toString().includes(search)
  );

  return (
    <div className="h-full flex flex-col bg-card border-r border-border/50">
      {/* Novel Info Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <img src={novel.cover} alt={novel.title} className="w-10 h-14 rounded object-cover shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-foreground truncate">{novel.title}</h3>
            <div className="text-xs text-muted-foreground mt-0.5">{novel.author.name}</div>
            <Badge variant="secondary" className="text-[10px] h-4 px-1 mt-1">{novel.category}</Badge>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索章节..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted rounded-md border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Chapter List */}
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {filtered.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onSelect(chapter.id)}
            className={cn(
              "w-full text-left px-2.5 py-2 rounded-md text-xs transition-colors mb-0.5",
              chapter.id === currentChapterId
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground hover:bg-muted/50"
            )}
          >
            <span className="text-muted-foreground mr-1.5">{chapter.order}.</span>
            {chapter.title}
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-6 text-xs text-muted-foreground">
            未找到相关章节
          </div>
        )}
      </div>
    </div>
  );
}
