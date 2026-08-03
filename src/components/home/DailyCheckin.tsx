"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Loader2, LogIn } from "lucide-react";

export function DailyCheckin() {
  const t = useTranslations("home");
  const router = useRouter();
  const { status } = useSession();
  const utils = trpc.useUtils();
  const isAuthenticated = status === "authenticated";

  const { data, isLoading } = trpc.checkin.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  const { mutate: doCheckin, isPending } = trpc.checkin.doCheckin.useMutation({
    onSuccess: () => {
      utils.checkin.getStatus.invalidate();
    },
  });

  const handleCheckin = () => {
    if (status === "loading") return;
    if (!isAuthenticated) {
      router.push("/zh-CN/login");
      return;
    }
    if (data?.hasCheckedInToday) return;
    doCheckin();
  };

  const days = data?.recentDays ?? [false, false, false, false, false, false, false];
  const checkedToday = isAuthenticated ? (data?.hasCheckedInToday ?? false) : false;
  const consecutiveDays = isAuthenticated ? (data?.consecutiveDays ?? 0) : 0;
  const showLoading = isLoading && isAuthenticated;

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t("dailyCheckin")}</h3>
        {isAuthenticated && (
          <span className="text-xs text-muted-foreground">
            {t("consecutiveDays")} {consecutiveDays}
          </span>
        )}
      </div>

      {showLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between gap-1">
            {days.map((dayChecked, idx) => {
              const dayNum = idx + 1;
              const isToday = idx === 6;
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-all",
                      dayChecked
                        ? "bg-orange-500 text-white"
                        : isToday
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {dayChecked ? "✓" : dayNum}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {t("day")}{dayNum}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleCheckin}
            disabled={isPending || checkedToday || status === "loading"}
            className={cn(
              "w-full rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2",
              checkedToday
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : !isAuthenticated
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                : "bg-orange-500 text-white hover:bg-orange-600"
            )}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : !isAuthenticated && status !== "loading" ? (
              <LogIn className="h-4 w-4" />
            ) : null}
            {checkedToday
              ? `${t("checkinNow")} ✓`
              : !isAuthenticated
              ? "登录签到"
              : `${t("checkinNow")} +${data?.reward ?? 50} ${t("starCoins")}`}
          </button>
        </>
      )}
    </div>
  );
}
