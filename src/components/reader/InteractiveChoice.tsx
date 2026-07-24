"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { InteractiveChoice as InteractiveChoiceType } from "@/types";

interface InteractiveChoiceProps {
  choice: InteractiveChoiceType;
  onChoice: (optionId: string) => void;
}

export function InteractiveChoiceCard({ choice, onChoice }: InteractiveChoiceProps) {
  const t = useTranslations("novel.read");
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (optionId: string) => {
    if (selected) return;
    setSelected(optionId);
    setTimeout(() => onChoice(optionId), 500);
  };

  return (
    <div className="my-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
      <div className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
          ?
        </span>
        {t("interactiveChoice")}
      </div>
      <div className="space-y-2">
        {choice.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            disabled={!!selected}
            className={cn(
              "w-full text-left px-4 py-3 rounded-lg text-sm transition-all",
              selected === option.id
                ? "bg-primary text-primary-foreground"
                : selected
                  ? "bg-muted/50 text-muted-foreground opacity-60"
                  : "bg-card border border-border hover:border-primary/50 hover:bg-primary/5 text-foreground"
            )}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
