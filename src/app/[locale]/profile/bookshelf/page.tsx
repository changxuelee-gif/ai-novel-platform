"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookshelfCard } from "@/components/bookshelf/BookshelfCard";
import { BookshelfFilter } from "@/components/bookshelf/BookshelfFilter";
import { mockBookshelf } from "@/lib/mock-data";
import { Search, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function BookshelfPage() {
  const t = useTranslations("profile.bookshelfPage");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("sortByRecent");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let items = [...mockBookshelf];

    // Filter by category
    if (category !== "all") {
      items = items.filter((item) => item.category === category);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q)
      );
    }

    // Sort
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
  }, [category, sortBy, search]);

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
        {filtered.length > 0 ? (
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
