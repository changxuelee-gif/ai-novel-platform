"use client";

import { useTranslations } from "next-intl";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Heart, Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
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

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "草稿", color: "bg-gray-500/10 text-gray-600" },
  PUBLISHED: { label: "已发布", color: "bg-green-500/10 text-green-600" },
  ARCHIVED: { label: "已归档", color: "bg-blue-500/10 text-blue-600" },
};

function formatNumber(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + "万";
  return num.toString();
}

export default function MyWorksPage() {
  const t = useTranslations("profile.page");

  const { data: userData } = trpc.user.getProfile.useQuery();
  const { data: novels, isLoading } = trpc.user.getMyNovels.useQuery();

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

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <ProfileSidebar user={user} assets={assets} />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {t("myWorks")}
              </h1>
              <Link href="/create">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  {t("startCreate")}
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : novels && novels.length > 0 ? (
              <div className="space-y-3">
                {novels.map((novel) => {
                  const status = statusConfig[novel.status] ?? statusConfig.ONGOING;
                  return (
                    <div key={novel.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/20 transition-all">
                      <img
                        src={novel.cover ?? ""}
                        alt={novel.title}
                        className="w-14 h-20 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-foreground truncate">{novel.title}</h3>
                          <Badge className={cn("text-[10px] h-4 px-1.5", status.color)}>
                            {status.label}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1.5">
                          {novel._count?.chapters ?? 0}章 · {new Date(novel.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(novel.views)}</span>
                          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(novel._count?.favorites ?? 0)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/novel/${novel.id}`}>
                          <Button size="sm" variant="outline">查看</Button>
                        </Link>
                        <Button size="sm">{t("continueCreate")}</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">还没有作品</h3>
                <p className="text-sm text-muted-foreground mb-6">开始创作您的第一部小说吧</p>
                <Link href="/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-1" />
                    {t("startCreate")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
