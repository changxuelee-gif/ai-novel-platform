import { AppLayout } from "@/components/layout/AppLayout";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { activityDetails } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  CalendarDays,
  Users,
  Star,
  Eye,
  Send,
  Trophy,
  ScrollText,
} from "lucide-react";

interface ActivityDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { id } = await params;
  const activity = activityDetails[id];

  if (!activity) {
    notFound();
  }

  const t = await getTranslations("activities");

  const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
    ongoing: "default",
    upcoming: "secondary",
    ended: "outline",
  };

  const statusLabel: Record<string, string> = {
    ongoing: t("ongoing"),
    upcoming: t("upcoming"),
    ended: t("ended"),
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div
          className={`relative rounded-xl bg-gradient-to-r ${activity.themeColor} p-8 text-white`}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant={statusVariant[activity.status]}>
                {statusLabel[activity.status]}
              </Badge>
              <span className="text-sm opacity-80">{activity.category}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
            <p className="text-lg opacity-90 mb-4">{activity.subtitle}</p>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                <span>
                  {activity.startDate} - {activity.endDate}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="size-4" />
                <span>
                  {activity.participants.toLocaleString()} {t("participants")}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/10 rounded-xl" />
        </div>

        <Separator className="my-6" />

        {/* Description */}
        <section className="mb-6">
          <p className="text-muted-foreground leading-relaxed">
            {activity.description}
          </p>
        </section>

        <Separator className="my-6" />

        {/* Rules Section */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ScrollText className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">{t("rules")}</h2>
          </div>
          <ol className="space-y-2">
            {activity.rules.map((rule, index) => (
              <li key={index} className="flex gap-3 text-muted-foreground">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {index + 1}
                </span>
                <span className="leading-6">{rule}</span>
              </li>
            ))}
          </ol>
        </section>

        <Separator className="my-6" />

        {/* Rewards Section */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">{t("rewards")}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {activity.rewards.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
                  {item.rank}
                </span>
                <span className="text-sm font-medium">{item.reward}</span>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-6" />

        {/* Submissions Section */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{t("submissions_list")}</h2>
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {activity.submissions.map((work) => (
              <div
                key={work.id}
                className="group rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={work.cover}
                    alt={work.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                  />
                  {work.rank <= 3 && (
                    <span className="absolute top-2 left-2 flex size-6 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">
                      {work.rank}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate">{work.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {work.author}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="size-3" />
                      {work.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="size-3" />
                      {work.views >= 10000
                        ? `${(work.views / 10000).toFixed(1)}万`
                        : work.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-6" />

        {/* Submit Button */}
        <div className="flex justify-center pb-8">
          <Button size="lg" className="h-12 px-8 text-base">
            <Send className="size-4 mr-2" />
            {t("submitWork")}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
