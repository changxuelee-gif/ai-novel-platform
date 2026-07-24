"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, FileText, Clock, Heart, Trophy, Bell, Settings, HelpCircle,
  ChevronRight, Crown, Wallet, DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserProfile, UserAssets } from "@/lib/mock-data";

interface ProfileSidebarProps {
  user: UserProfile;
  assets: UserAssets;
}

const navItems = [
  { href: "/profile/bookshelf", icon: BookOpen, labelKey: "profile.bookshelf" },
  { href: "/profile/works", icon: FileText, labelKey: "profile.myWorks" },
  { href: "/profile/history", icon: Clock, labelKey: "profile.readingHistory" },
  { href: "/profile/favorites", icon: Heart, labelKey: "profile.favorites" },
  { href: "/activities", icon: Trophy, labelKey: "nav.activityCenter" },
  { href: "/profile/messages", icon: Bell, labelKey: "profile.page.messageNotification" },
  { href: "/profile/earnings", icon: DollarSign, labelKey: "profile.page.earningsNav" },
  { href: "/settings", icon: Settings, labelKey: "nav.settings" },
  { href: "/profile/help", icon: HelpCircle, labelKey: "profile.page.helpCenter" },
];

export function ProfileSidebar({ user, assets }: ProfileSidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <div className="w-72 shrink-0 bg-card border-r border-border/50 overflow-y-auto">
      {/* Banner */}
      <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
        <div className="absolute -bottom-8 left-4">
          <Avatar className="w-16 h-16 border-4 border-card">
            <img src={user.avatar} alt={user.name} />
          </Avatar>
        </div>
      </div>

      {/* User Info */}
      <div className="pt-10 px-4 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-bold text-foreground">{user.name}</h2>
          {user.vip && (
            <Badge className="bg-amber-500 text-white text-[10px] h-4 px-1.5">
              <Crown className="w-3 h-3 mr-0.5" />
              {t("profile.page.vip")}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-3">{user.bio}</p>

        {/* Stats */}
        <div className="flex gap-4 mb-3 text-center">
          <div>
            <div className="text-sm font-bold text-foreground">{user.following}</div>
            <div className="text-[10px] text-muted-foreground">{t("nav.my")}{t("novel.follow")}</div>
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">{user.followers}</div>
            <div className="text-[10px] text-muted-foreground">{t("profile.page.followers")}</div>
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">{user.works}</div>
            <div className="text-[10px] text-muted-foreground">{t("profile.page.myWorks")}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <Button size="sm" variant="outline" className="flex-1 text-xs">{t("profile.page.editProfile")}</Button>
          <Button size="sm" className="flex-1 text-xs">{t("profile.page.startCreate")}</Button>
        </div>

        {/* Assets */}
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <h4 className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5" />
            {t("profile.page.myAssets")}
          </h4>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">{t("profile.page.coins")}</span>
              <span className="text-sm font-bold text-amber-500">{assets.coins.toLocaleString()}</span>
            </div>
            <Button size="sm" variant="outline" className="text-[10px] h-6 px-2">{t("profile.page.recharge")}</Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">{t("profile.page.membershipExpiry")}</span>
              <span className="text-xs text-foreground">{assets.membershipExpiry}</span>
            </div>
            <Button size="sm" variant="outline" className="text-[10px] h-6 px-2">{t("profile.page.renew")}</Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-2 pb-4">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href.split("/")[1]);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{t(item.labelKey)}</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
