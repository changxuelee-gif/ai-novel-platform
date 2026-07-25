"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookshelfCard } from "@/components/bookshelf/BookshelfCard";
import { BookshelfFilter } from "@/components/bookshelf/BookshelfFilter";
import { Search, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trpc } from "@/trpc/client";

export default function BookshelfPage() {
  const t = useTranslations("profile.bookshelfPage");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("sortByRecent");
  const [search, setSearch] = useState("");

  const { data, isLoading } = trpc.interaction.getBookshelf.useQuery();

  const bookshelfItems = useMemo(() => {
    if (!data) return [];
    return data.map((fav) => ({
      novelId: fav.novelId,
      title: fav.novel?.title ?? "Unknown",
      author: fav.novel?.author?.name ?? "Unknown",
      cover: fav.novel?.cover ?? "",
      category: (fav.novel?.category?.slug ?? "all") as "all" | "following" | "completed" | "pending",
      progress: fav.chapterOrder ?? 0,
      lastReadChapter: "-",
      addedAt: fav.createdAt.toISOString().split("T")[0],
      updatedAt: fav.createdAt.toISOString().split("T")[0],
    }));
  }, [data]);

  const filtered = useMemo(() => {
    let items = [...bookshelfItems];

    if (category !== "all") {
      items = items.filter((item) => item.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "sortByAdded":
        items.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
        break;
      case "sortByUpdated":
        items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        break;
      default:
        items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }

    return items;
  }, [bookshelfItems, category, sortBy, search]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{t("all")}</h1>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Filter */}
        <BookshelfFilter
          activeCategory={category}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((item) => (
              <BookshelfCard key={item.novelId} item={item} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t("emptyTitle")}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("emptyDesc")}
            </p>
            <Link href="/">
              <Button>{t("goExplore")}</Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
