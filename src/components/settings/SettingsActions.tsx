"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface SettingsActionsProps {
  onSave: () => void;
  onReset: () => void;
}

export function SettingsActions({ onSave, onReset }: SettingsActionsProps) {
  const t = useTranslations("settings.languageSettings");
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = () => {
    onSave();
    setMessage(t("saveSuccess"));
    setTimeout(() => setMessage(null), 3000);
  };

  const handleReset = () => {
    onReset();
    setMessage(t("resetSuccess"));
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="flex items-center justify-between pt-6 border-t border-border/50">
      {message && (
        <span className="text-sm text-green-600">{message}</span>
      )}
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={handleReset}>
          {t("resetDefault")}
        </Button>
        <Button size="sm" onClick={handleSave}>
          {t("saveSettings")}
        </Button>
      </div>
    </div>
  );
}
