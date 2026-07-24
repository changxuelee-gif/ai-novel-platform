"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  MessageCircle,
  Share2,
  BookOpen,
  Flame,
  Users,
  Star,
} from "lucide-react";
import type { AuthorProfile } from "@/types/novel";

interface AuthorHeaderProps {
  data: AuthorProfile;
}

export function AuthorHeader({ data }: AuthorHeaderProps) {
  const t = useTranslations("author");

  const stats = [
    { label: t("worksCount"), value: data.worksCount, icon: BookOpen },
    { label: t("totalHeat"), value: data.totalHeat, icon: Flame },
    {
      label: t("followers"),
      value:
        data.followers >= 10000
          ? (data.followers / 10000).toFixed(1) + "k"
          : data.followers.toString(),
      icon: Users,
    },
    { label: t("rating"), value: data.rating, icon: Star },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="relative px-6 py-8 sm:px-8">
        {/* Top section: avatar + info + actions */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="rounded-2xl bg-blue-600/20 p-1">
              <Avatar className="size-20 rounded-xl">
                <AvatarImage
                  src={data.avatar}
                  alt={data.name}
                  className="rounded-xl"
                />
                <AvatarFallback className="rounded-xl text-2xl font-bold text-white bg-blue-600">
                  {data.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-white truncate">
                {data.name}
              </h1>
              {data.verified && (
                <Badge className="gap-1 bg-blue-600/20 text-blue-300 border-blue-500/30">
                  <CheckCircle2 className="size-3" />
                  {t("verified")}
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 max-w-xl">
              {data.bio}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 mt-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <stat.icon className="size-4 text-slate-500" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-semibold text-white">
                      {stat.value}
                    </span>
                    <span className="text-xs text-slate-500">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:shrink-0">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              {t("follow")}
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <MessageCircle className="size-4" />
              {t("message")}
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
