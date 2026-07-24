"use client";

import { useTranslations } from "next-intl";
import { Plus, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AICreationLanguageProps {
  primaryLanguage: string;
  onPrimaryLanguageChange: (lang: string) => void;
  auxLanguages: string[];
  onAuxLanguagesChange: (langs: string[]) => void;
}

const languageOptions = [
  { code: "zh-CN", name: "简体中文" },
  { code: "zh-TW", name: "繁体中文" },
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
];

export function AICreationLanguage({ primaryLanguage, onPrimaryLanguageChange, auxLanguages, onAuxLanguagesChange }: AICreationLanguageProps) {
  const t = useTranslations("settings.languageSettings");

  const availableAuxLanguages = languageOptions.filter((lang) => lang.code !== primaryLanguage);

  const handleAddAux = (lang: string) => {
    if (!auxLanguages.includes(lang)) {
      onAuxLanguagesChange([...auxLanguages, lang]);
    }
  };

  const handleRemoveAux = (lang: string) => {
    onAuxLanguagesChange(auxLanguages.filter((l) => l !== lang));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">{t("aiCreationLanguage")}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t("aiCreationLanguageDesc")}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-2">
            <span>{t("primaryLanguage")}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onPrimaryLanguageChange(lang.code)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm border transition-all",
                  primaryLanguage === lang.code
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border/50 text-muted-foreground hover:border-primary/30"
                )}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <label className="text-xs font-medium text-foreground">{t("auxLanguage")}</label>
            <span className="text-xs text-muted-foreground">{t("optional")}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {auxLanguages.map((lang) => {
              const langInfo = languageOptions.find((l) => l.code === lang);
              return (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-lg"
                >
                  {langInfo?.name}
                  <button
                    onClick={() => handleRemoveAux(lang)}
                    className="hover:text-primary/70 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            {auxLanguages.length < 3 && (
              <button
                onClick={() => {
                  const firstAvailable = availableAuxLanguages.find((l) => !auxLanguages.includes(l.code));
                  if (firstAvailable) handleAddAux(firstAvailable.code);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-border/50 text-muted-foreground text-sm rounded-lg hover:border-primary/30 hover:text-primary transition-colors"
              >
                <Plus className="w-3 h-3" />
                {t("addLanguage")}
              </button>
            )}
          </div>
          <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 rounded-lg">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">{t("tipDesc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
