"use client";

import { useTranslations } from "next-intl";
import { MapPin, Clock } from "lucide-react";

interface RegionTimezoneProps {
  region: string;
  onRegionChange: (region: string) => void;
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

const regions = [
  { code: "CN", name: "中国" },
  { code: "US", name: "United States" },
  { code: "JP", name: "日本" },
  { code: "KR", name: "韩国" },
  { code: "TW", name: "台湾" },
  { code: "HK", name: "香港" },
  { code: "SG", name: "新加坡" },
];

const timezones = [
  { code: "UTC+8", name: "UTC+8 (中国标准时间)" },
  { code: "UTC+9", name: "UTC+9 (日本标准时间)" },
  { code: "UTC+9", name: "UTC+9 (韩国标准时间)" },
  { code: "UTC-5", name: "UTC-5 (美国东部时间)" },
  { code: "UTC-8", name: "UTC-8 (美国太平洋时间)" },
];

export function RegionTimezone({ region, onRegionChange, timezone, onTimezoneChange }: RegionTimezoneProps) {
  const t = useTranslations("settings.languageSettings");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">{t("regionAndTimezone")}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-2">
            <MapPin className="w-3 h-3" />
            {t("region")}
          </label>
          <select
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border/50 rounded-lg bg-card text-foreground focus:outline-none focus:border-primary"
          >
            {regions.map((r) => (
              <option key={r.code} value={r.code}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-2">
            <Clock className="w-3 h-3" />
            {t("timezone")}
          </label>
          <select
            value={timezone}
            onChange={(e) => onTimezoneChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border/50 rounded-lg bg-card text-foreground focus:outline-none focus:border-primary"
          >
            {timezones.map((tz) => (
              <option key={tz.code} value={tz.code}>
                {tz.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
