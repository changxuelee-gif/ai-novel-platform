"use client";

import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { Globe, BookOpen, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AITranslationSettingsProps {
  enabled: boolean;
  onToggle: () => void;
  targetLanguage: string;
  onTargetLanguageChange: (lang: string) => void;
}

const targetLanguages = [
  { code: "auto", name: "sameAsInterface" },
  { code: "zh-CN", name: "简体中文" },
  { code: "zh-TW", name: "繁体中文" },
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
];

export function AITranslationSettings({ enabled, onToggle, targetLanguage, onTargetLanguageChange }: AITranslationSettingsProps) {
  const t = useTranslations("settings.languageSettings");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">{t("aiTranslation")}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t("aiTranslationDesc")}</p>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>

      {enabled && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 border border-border/30">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">{t("smartTranslationEngine")}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t("smartTranslationDesc")}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-md">
                <Globe className="w-3 h-3" />
                {t("preserveTerms")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-md">
                <BookOpen className="w-3 h-3" />
                {t("styleConsistency")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-md">
                <Zap className="w-3 h-3" />
                {t("realtimeTranslation")}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-foreground">{t("defaultTranslationTarget")}</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{t("defaultTranslationTargetDesc")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {targetLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onTargetLanguageChange(lang.code)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm border transition-all",
                    targetLanguage === lang.code
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border/50 text-muted-foreground hover:border-primary/30"
                  )}
                >
                  {lang.code === "auto" ? t(lang.name) : lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
