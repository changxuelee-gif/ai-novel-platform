import { AppLayout } from "@/components/layout/AppLayout";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { appRouter } from "@/server/routers/_app";
import { createCallerFactory } from "@/server/trpc";
import { createContext } from "@/server/trpc/context";
import { CalendarDays, Users, Send } from "lucide-react";

const createCaller = createCallerFactory(appRouter);

interface ActivityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const { id } = await params;
  const ctx = await createContext();
  const caller = createCaller(ctx);

  try {
    const activity = await caller.activity.getById({ id });
    const t = await getTranslations("activities");

    const statusMap: Record<string, "ongoing" | "upcoming" | "ended"> = {
      ACTIVE: "ongoing",
      UPCOMING: "upcoming",
      ENDED: "ended",
    };
    const status = statusMap[activity.status] ?? "ongoing";

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

    const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header Section */}
          <div className="relative rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant={statusVariant[status]}>
                  {statusLabel[status]}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
              <p className="text-lg opacity-90 mb-4">{activity.description ?? ""}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" />
                  <span>
                    {fmt(activity.startDate)} - {fmt(activity.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="size-4" />
                  <span>
                    {activity._count?.submissions ?? 0} {t("participants")}
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
              {activity.description ?? ""}
            </p>
          </section>

          <Separator className="my-6" />

          {/* Submissions Section */}
          <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t("submissions_list")}</h2>
            </div>
            <div className="text-sm text-muted-foreground py-8 text-center">
              暂无投稿作品
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
  } catch {
    notFound();
  }
}
