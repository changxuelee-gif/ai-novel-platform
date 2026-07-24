"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { checkinDays } from "@/lib/mock-data";

export function DailyCheckin() {
  const t = useTranslations("home");
  const [days, setDays] = useState(checkinDays);
  const [checked, setChecked] = useState(false);

  const handleCheckin = () => {
    if (checked) return;
    setChecked(true);
    setDays((prev) =>
      prev.map((d) => (d.isToday ? { ...d, checked: true } : d))
    );
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t("dailyCheckin")}</h3>
        <span className="text-xs text-muted-foreground">
          {t("consecutiveDays")}
        </span>
      </div>

      {/* Day dots */}
      <div className="mb-4 flex items-center justify-between gap-1">
        {days.map((day) => (
          <div key={day.day} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-all",
                day.checked
                  ? "bg-orange-500 text-white"
                  : day.isToday
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {day.checked ? "✓" : day.day}
            </div>
            <span className="text-[10px] text-muted-foreground">
              {t("day")}{day.day}
            </span>
          </div>
        ))}
      </div>

      {/* Checkin button */}
      <button
        onClick={handleCheckin}
        disabled={checked}
        className={cn(
          "w-full rounded-lg py-2 text-sm font-medium transition-colors",
          checked
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-orange-500 text-white hover:bg-orange-600"
        )}
      >
        {checked
          ? `${t("checkinNow")} ✓`
          : `${t("checkinNow")} +50 ${t("starCoins")}`}
      </button>
    </div>
  );
}
