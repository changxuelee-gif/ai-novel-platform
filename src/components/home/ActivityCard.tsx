"use client";

import type { ActivityCardData } from "@/types/novel";

interface ActivityCardProps {
  activity: ActivityCardData;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div
      className={`relative flex items-center overflow-hidden rounded-lg p-4 text-white ${activity.themeColor} min-h-[120px]`}
    >
      <div className="relative z-10 flex-1 min-w-0">
        <h3 className="text-sm font-bold leading-tight">{activity.title}</h3>
        {activity.startDate && activity.endDate && (
          <p className="mt-1 text-xs opacity-80">
            {activity.startDate} - {activity.endDate}
          </p>
        )}
        <p className="mt-1 text-[11px] opacity-70 line-clamp-2">
          {activity.subtitle}
        </p>
      </div>
      {activity.cover && (
        <div className="ml-3 shrink-0">
          <img
            src={activity.cover}
            alt={activity.title}
            className="h-16 w-16 rounded-md object-cover opacity-90"
          />
        </div>
      )}
    </div>
  );
}
