"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ListOrdered, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreationModeDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectMode: (mode: "oneclick" | "guided" | "manual") => void;
}

interface ModeOption {
  mode: "oneclick" | "guided" | "manual";
  icon: typeof Sparkles;
  title: string;
  description: string;
  recommended?: boolean;
  gradient?: string;
}

const MODE_OPTIONS: ModeOption[] = [
  {
    mode: "oneclick",
    icon: Sparkles,
    title: "一句话创作",
    description: "输入一句话构想，AI自动生成完整小说，适合快速体验",
    recommended: true,
    gradient: "from-violet-500/10 to-purple-600/10 border-violet-500/50",
  },
  {
    mode: "guided",
    icon: ListOrdered,
    title: "引导式创作",
    description: "分步设定世界观、角色、大纲，精细创作长篇作品",
  },
  {
    mode: "manual",
    icon: Pencil,
    title: "手动创作",
    description: "打开空白编辑器，自由写作",
  },
];

export function CreationModeDialog({
  open,
  onClose,
  onSelectMode,
}: CreationModeDialogProps) {
  const handleSelect = (mode: "oneclick" | "guided" | "manual") => {
    onSelectMode(mode);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>选择创作模式</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          {MODE_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.mode}
                onClick={() => handleSelect(option.mode)}
                className={cn(
                  "relative flex items-start gap-3 rounded-lg border p-4 text-left transition-colors cursor-pointer",
                  "hover:border-primary",
                  option.recommended && option.gradient
                )}
              >
                {option.recommended && (
                  <Badge
                    className="absolute -top-2 right-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0"
                  >
                    推荐
                  </Badge>
                )}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    option.recommended
                      ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground">
                    {option.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
