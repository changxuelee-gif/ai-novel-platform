"use client";

import { useTranslations } from "next-intl";
import { useReaderStore } from "@/stores/useReaderStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReaderSettings as ReaderSettingsType } from "@/types";

const bgColors: { key: ReaderSettingsType["bgColor"]; label: string; color: string; text: string }[] = [
  { key: "day", label: "dayMode", color: "#ffffff", text: "#333333" },
  { key: "night", label: "nightMode", color: "#1a1a2e", text: "#cccccc" },
  { key: "eye", label: "eyeMode", color: "#f5f5dc", text: "#5b5b3a" },
  { key: "parchment", label: "parchmentMode", color: "#f4e4c1", text: "#6b5b3a" },
];

const lineHeights = [1.5, 1.8, 2.0, 2.5];
const pageModes: { key: ReaderSettingsType["pageMode"]; label: string }[] = [
  { key: "scroll", label: "scrollMode" },
  { key: "click", label: "clickMode" },
  { key: "none", label: "noneMode" },
];

export function ReaderSettings() {
  const t = useTranslations("novel.read");
  const { settings, setFontSize, setLineHeight, setBgColor, setPageMode, resetSettings } =
    useReaderStore();

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5 max-w-md mx-auto">
      {/* Font Size */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">{t("fontSize")}</label>
          <span className="text-sm text-muted-foreground">{settings.fontSize}px</span>
        </div>
        <input
          type="range"
          min={12}
          max={24}
          value={settings.fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>12px</span>
          <span>24px</span>
        </div>
      </div>

      {/* Line Height */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">{t("lineHeight")}</label>
        <div className="flex gap-2">
          {lineHeights.map((h) => (
            <button
              key={h}
              onClick={() => setLineHeight(h)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                settings.lineHeight === h
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">{t("bgColor")}</label>
        <div className="flex gap-3">
          {bgColors.map((bg) => (
            <button
              key={bg.key}
              onClick={() => setBgColor(bg.key)}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all",
                settings.bgColor === bg.key && "scale-110"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 transition-all",
                  settings.bgColor === bg.key
                    ? "border-primary shadow-md"
                    : "border-border/50"
                )}
                style={{ backgroundColor: bg.color }}
              />
              <span className="text-[10px] text-muted-foreground">
                {t(bg.label)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Page Mode */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">{t("pageMode")}</label>
        <div className="flex gap-2">
          {pageModes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => setPageMode(mode.key)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                settings.pageMode === mode.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {t(mode.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="text-center">
        <Button variant="ghost" size="sm" onClick={resetSettings}>
          {t("reset")}
        </Button>
      </div>
    </div>
  );
}
