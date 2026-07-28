"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { Heart, Search, Trash2 } from "lucide-react";
import { trpc } from "@/trpc/client";

const defaultUser = {
  id: "",
  name: "用户",
  avatar: "",
  vip: false,
  bio: "",
  following: 0,
  followers: 0,
  works: 0,
  banner: "",
};

export default function FavoritesPage() {
  const t = useTranslations("profile");
  const [search, setSearch] = useState("");

  const { data: userData } = trpc.user.getProfile.useQuery();
  const { data: favorites, isLoading, refetch } = trpc.interaction.getFavorites.useQuery();
  const removeFavorite = trpc.interaction.removeFavorite.useMutation({
    onSuccess: () => refetch(),
  });

  const user = userData
    ? {
        ...defaultUser,
        id: userData.id,
        name: userData.name ?? "用户",
        avatar: userData.avatar ?? userData.image ?? "",
        vip: userData.role === "VERIFIED" || userData.role === "AUTHOR",
        bio: userData.bio ?? "",
        following: userData._count?.following ?? 0,
        followers: userData._count?.followers ?? 0,
        works: userData._count?.novels ?? 0,
      }
    : defaultUser;

  const assets = {
    coins: userData?.coins ?? 0,
    membershipExpiry: "",
  };

  const filteredFavorites = (favorites ?? []).filter((fav) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      fav.novel?.title?.toLowerCase().includes(q) ||
      fav.novel?.author?.name?.toLowerCase().includes(q)
    );
  });

  const handleRemove = (novelId: string) => {
    removeFavorite.mutate({ novelId });
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <ProfileSidebar user={user} assets={assets} />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                {t("favorites")}
              </h1>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t("bookshelfPage.search")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-56 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : filteredFavorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredFavorites.map((fav) => (
                  <div key={fav.id} className="group relative">
                    <Link href={`/novel/${fav.novelId}`}>
                      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                        <img
                          src={fav.novel?.cover ?? ""}
                          alt={fav.novel?.title ?? ""}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="mt-2">
                        <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {fav.novel?.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {fav.novel?.author?.name}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleRemove(fav.novelId)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                      title={t("bookshelfPage.remove")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Heart className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  暂无收藏
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  浏览小说时点击收藏，将喜欢的作品加入收藏夹
                </p>
                <Link href="/">
                  <Button>去发现好书</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
