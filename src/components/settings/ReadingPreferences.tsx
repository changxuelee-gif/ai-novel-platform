"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ReadingPreferencesProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  lineHeight: number;
  onLineHeightChange: (height: number) => void;
  bgColor: string;
  onBgColorChange: (color: string) => void;
}

const fontSizeOptions = [
  { value: 14, label: "fontSizeSmall" },
  { value: 16, label: "fontSizeMedium" },
  { value: 18, label: "fontSizeLarge" },
  { value: 20, label: "fontSizeXLarge" },
];

const bgColorOptions = [
  { value: "#ffffff", label: "bgColorWhite" },
  { value: "#fdf6e3", label: "bgColorCream" },
  { value: "#e8f5e9", label: "bgColorGreen" },
  { value: "#2d2d2d", label: "bgColorDark" },
];

export function ReadingPreferences({ fontSize, onFontSizeChange, lineHeight, onLineHeightChange, bgColor, onBgColorChange }: ReadingPreferencesProps) {
  const t = useTranslations("settings.readingPreferences");

  return (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-4">{t("title")}</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-medium text-foreground mb-2">{t("fontSize")}</label>
          <div className="flex gap-2">
            {fontSizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onFontSizeChange(option.value)}
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg text-sm border transition-all",
                  fontSize === option.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border/50 text-muted-foreground hover:border-primary/30"
                )}
              >
                {t(option.label)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-foreground">{t("lineHeight")}</label>
            <span className="text-xs text-muted-foreground">{lineHeight}x</span>
          </div>
          <input
            type="range"
            min="1.4"
            max="2.4"
            step="0.2"
            value={lineHeight}
            onChange={(e) => onLineHeightChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1.4x</span>
            <span>2.4x</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-2">{t("bgColor")}</label>
          <div className="flex gap-2">
            {bgColorOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onBgColorChange(option.value)}
                className={cn(
                  "flex-1 px-3 py-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center",
                  bgColor === option.value
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border/50 hover:border-primary/30"
                )}
                style={{ backgroundColor: option.value }}
              >
                <div className="w-6 h-6 rounded-full border border-border/50 mb-1" style={{ backgroundColor: option.value }} />
                <span className={cn(
                  "text-xs",
                  option.value === "#2d2d2d" ? "text-white" : "text-muted-foreground"
                )}>
                  {t(option.label)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
