"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Check, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

export function CheckInCalendar() {
  const t = useTranslations();
  const [currentMonth] = useState(7);
  const [checkedDays, setCheckedDays] = useState(new Set([1, 2, 3, 4, 8]));
  const today = 8;
  const consecutiveDays = 4;

  const daysInMonth = 31;
  const firstDayOfWeek = 2; // Tuesday

  const handleCheckIn = () => {
    if (!checkedDays.has(today)) {
      setCheckedDays((prev) => new Set([...Array.from(prev), today]));
    }
  };

  const isCheckedInToday = checkedDays.has(today);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          {t("profile.page.checkInCalendar")}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">2026年{currentMonth}月</span>
          <div className="flex gap-1">
            <button className="p-1 rounded hover:bg-muted"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1 rounded hover:bg-muted"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/50 p-4">
        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            {t("profile.page.checkedIn")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary" />
            {t("profile.page.today")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-border" />
            {t("profile.page.pendingCheckIn")}
          </span>
          <span className="ml-auto text-amber-500 font-medium flex items-center gap-1">
            {t("profile.page.consecutiveCheckIn")} <strong>{consecutiveDays}</strong> {t("profile.page.days")}
          </span>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
            <div key={d} className="text-center text-xs text-muted-foreground py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isChecked = checkedDays.has(day);
            const isToday = day === today;

            return (
              <div
                key={day}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-colors",
                  isToday && "bg-primary text-primary-foreground font-bold",
                  isChecked && !isToday && "bg-amber-400/20 text-amber-600",
                  !isChecked && !isToday && "text-foreground hover:bg-muted/50"
                )}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Check-in button */}
        <Button
          onClick={handleCheckIn}
          disabled={isCheckedInToday}
          className={cn(
            "w-full mt-4 gap-2",
            isCheckedInToday
              ? "bg-amber-500 hover:bg-amber-500 text-white"
              : ""
          )}
        >
          {isCheckedInToday ? (
            <>
              <Check className="w-4 h-4" />
              {t("profile.page.checkInToday")}
            </>
          ) : (
            <>
              <Gift className="w-4 h-4" />
              {t("home.checkinNow")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
