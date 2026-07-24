"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  selected: string;
  onSelect: (lang: string) => void;
}

const languages = [
  { code: "zh-CN", name: "简体中文", flag: "🇨🇳" },
  { code: "zh-TW", name: "繁体中文", flag: "🇹🇼" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
];

export function LanguageSelector({ selected, onSelect }: LanguageSelectorProps) {
  const t = useTranslations("settings.languageSettings");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">{t("interfaceLanguage")}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t("interfaceLanguageDesc")}</p>
        </div>
        <span className="text-xs text-muted-foreground">{t("languagesAvailable", { count: languages.length })}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border transition-all",
              selected === lang.code
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border/50 hover:border-primary/30 bg-card"
            )}
          >
            <span className="text-2xl mb-2">{lang.flag}</span>
            <span className="text-sm font-medium text-foreground">{lang.name}</span>
            {selected === lang.code && (
              <span className="text-xs text-primary mt-1">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
