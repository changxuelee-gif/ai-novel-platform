"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Check, Gift, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function CheckInCalendar() {
  const t = useTranslations("profile");
  const router = useRouter();
  const { status } = useSession();
  const utils = trpc.useUtils();
  const isAuthenticated = status === "authenticated";

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const { data, isLoading } = trpc.checkin.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  const { mutate: doCheckin, isPending } = trpc.checkin.doCheckin.useMutation({
    onSuccess: () => {
      utils.checkin.getStatus.invalidate();
    },
  });

  const checkedDatesSet = useMemo(() => {
    if (!data?.monthDays) return new Set<string>();
    return new Set(
      data.monthDays.map((d) => {
        const date = new Date(d);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      })
    );
  }, [data?.monthDays]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfMonth(currentYear, currentMonth);

  const isToday = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return isSameDay(date, today);
  };

  const isChecked = (day: number) => {
    return checkedDatesSet.has(`${currentYear}-${currentMonth}-${day}`);
  };

  const isCheckedInToday = isAuthenticated ? (data?.hasCheckedInToday ?? false) : false;
  const consecutiveDays = isAuthenticated ? (data?.consecutiveDays ?? 0) : 0;
  const showLoading = isLoading && isAuthenticated;

  const handleCheckIn = () => {
    if (status === "loading") return;
    if (!isAuthenticated) {
      router.push("/zh-CN/login");
      return;
    }
    if (isCheckedInToday) return;
    doCheckin();
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月",
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          {t("page.checkInCalendar")}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {currentYear}年{monthNames[currentMonth]}
          </span>
          <div className="flex gap-1">
            <button
              className="p-1 rounded hover:bg-muted transition-colors"
              onClick={goToPrevMonth}
              type="button"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="p-1 rounded hover:bg-muted transition-colors"
              onClick={goToNextMonth}
              type="button"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/50 p-4">
        <div className="flex items-center gap-4 mb-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            {t("page.checkedIn")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary" />
            {t("page.today")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-border" />
            {t("page.pendingCheckIn")}
          </span>
          {isAuthenticated && (
            <span className="ml-auto text-amber-500 font-medium flex items-center gap-1">
              {t("page.consecutiveCheckIn")} <strong>{consecutiveDays}</strong> {t("page.days")}
            </span>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
            <div key={d} className="text-center text-xs text-muted-foreground py-1">{d}</div>
          ))}
        </div>

        {showLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayChecked = isChecked(day);
                const dayIsToday = isToday(day);

                return (
                  <div
                    key={day}
                    className={cn(
                      "aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-colors",
                      dayIsToday && "bg-primary text-primary-foreground font-bold",
                      dayChecked && !dayIsToday && "bg-amber-400/20 text-amber-600",
                      !dayChecked && !dayIsToday && "text-foreground hover:bg-muted/50"
                    )}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <Button
              onClick={handleCheckIn}
              disabled={isPending || isCheckedInToday || status === "loading"}
              className={cn(
                "w-full mt-4 gap-2",
                isCheckedInToday
                  ? "bg-amber-500 hover:bg-amber-500 text-white"
                  : ""
              )}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isCheckedInToday ? (
                <>
                  <Check className="w-4 h-4" />
                  {t("page.checkInToday")}
                </>
              ) : !isAuthenticated ? (
                <>
                  <Gift className="w-4 h-4" />
                  登录签到
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  立即签到 +{data?.reward ?? 50}
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
