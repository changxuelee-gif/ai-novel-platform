"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface PrivacySettingsProps {
  defaultVisibility: "public" | "private";
  onDefaultVisibilityChange: (value: "public" | "private") => void;
  commentPermission: "all" | "followers" | "none";
  onCommentPermissionChange: (value: "all" | "followers" | "none") => void;
}

const visibilityOptions = [
  { value: "public", label: "visibilityPublic" },
  { value: "private", label: "visibilityPrivate" },
];

const commentOptions = [
  { value: "all", label: "commentAll" },
  { value: "followers", label: "commentFollowers" },
  { value: "none", label: "commentNone" },
];

export function PrivacySettings({ defaultVisibility, onDefaultVisibilityChange, commentPermission, onCommentPermissionChange }: PrivacySettingsProps) {
  const t = useTranslations("settings.privacySettings");

  return (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-4">{t("title")}</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-medium text-foreground mb-2">{t("defaultVisibility")}</label>
          <div className="flex gap-2">
            {visibilityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onDefaultVisibilityChange(option.value as "public" | "private")}
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg text-sm border transition-all",
                  defaultVisibility === option.value
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
          <label className="block text-xs font-medium text-foreground mb-2">{t("commentPermission")}</label>
          <div className="flex gap-2">
            {commentOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onCommentPermissionChange(option.value as "all" | "followers" | "none")}
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg text-sm border transition-all",
                  commentPermission === option.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border/50 text-muted-foreground hover:border-primary/30"
                )}
              >
                {t(option.label)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
