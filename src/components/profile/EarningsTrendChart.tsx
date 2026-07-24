"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { TrendDataPoint } from "@/lib/mock-data";

interface EarningsTrendChartProps {
  data: TrendDataPoint[];
  period: "7d" | "30d";
  onPeriodChange: (period: "7d" | "30d") => void;
}

export function EarningsTrendChart({ data, period, onPeriodChange }: EarningsTrendChartProps) {
  const t = useTranslations("profile.earningsPage");

  const maxReads = Math.max(...data.map((d) => d.reads));
  const maxIncome = Math.max(...data.map((d) => d.income));

  const width = 600;
  const height = 200;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const getX = (index: number) => padding + (index / (data.length - 1)) * chartWidth;
  const getYReads = (value: number) => height - padding - (value / maxReads) * chartHeight;
  const getYIncome = (value: number) => height - padding - (value / maxIncome) * chartHeight;

  const readsPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getYReads(d.reads)}`)
    .join(" ");

  const incomePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getYIncome(d.income)}`)
    .join(" ");

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-foreground">{t("trendTitle")}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onPeriodChange("7d")}
            className={cn(
              "px-3 py-1.5 text-xs rounded-lg transition-all",
              period === "7d"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t("last7Days")}
          </button>
          <button
            onClick={() => onPeriodChange("30d")}
            className={cn(
              "px-3 py-1.5 text-xs rounded-lg transition-all",
              period === "30d"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t("last30Days")}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-blue-500" />
          <span className="text-xs text-muted-foreground">{t("readsTrend")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-green-500" />
          <span className="text-xs text-muted-foreground">{t("incomeTrend")}</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="readsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>

        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" strokeWidth={1} />

        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={padding}
            y1={height - padding - ratio * chartHeight}
            x2={width - padding}
            y2={height - padding - ratio * chartHeight}
            stroke="#f3f4f6"
            strokeWidth={1}
            strokeDasharray="4"
          />
        ))}

        <path
          d={`${readsPath} L ${getX(data.length - 1)} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="url(#readsGradient)"
        />
        <path d={readsPath} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        <path
          d={`${incomePath} L ${getX(data.length - 1)} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="url(#incomeGradient)"
        />
        <path d={incomePath} fill="none" stroke="#22c55e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {data.map((d, i) => (
          <text
            key={i}
            x={getX(i)}
            y={height - 10}
            textAnchor="middle"
            className="fill-gray-400 text-[10px]"
          >
            {d.label}
          </text>
        ))}

        {data.map((d, i) => (
          <circle
            key={`reads-${i}`}
            cx={getX(i)}
            cy={getYReads(d.reads)}
            r={3}
            fill="#3b82f6"
            className="opacity-0 hover:opacity-100 transition-opacity"
          />
        ))}
        {data.map((d, i) => (
          <circle
            key={`income-${i}`}
            cx={getX(i)}
            cy={getYIncome(d.income)}
            r={3}
            fill="#22c55e"
            className="opacity-0 hover:opacity-100 transition-opacity"
          />
        ))}
      </svg>
    </div>
  );
}
