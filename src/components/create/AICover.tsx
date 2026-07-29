"use client";

import { cn } from "@/lib/utils";

type CategoryKey =
  | "玄幻"
  | "都市"
  | "仙侠"
  | "科幻"
  | "竞技"
  | "历史"
  | "悬疑"
  | "言情";

const CATEGORY_GRADIENTS: Record<CategoryKey, string> = {
  玄幻: "from-purple-600 to-indigo-700",
  都市: "from-blue-500 to-cyan-600",
  仙侠: "from-teal-500 to-emerald-600",
  科幻: "from-indigo-500 to-purple-600",
  竞技: "from-orange-500 to-red-500",
  历史: "from-amber-600 to-yellow-700",
  悬疑: "from-gray-600 to-slate-800",
  言情: "from-pink-500 to-rose-600",
};

const SIZE_CLASSES = {
  sm: {
    container: "w-16 h-20",
    title: "text-xs leading-tight",
    tag: "text-[8px] px-1 py-0.5",
    lines: "scale-50",
  },
  md: {
    container: "w-24 h-32",
    title: "text-sm leading-snug",
    tag: "text-[10px] px-1.5 py-0.5",
    lines: "scale-75",
  },
  lg: {
    container: "w-40 h-56",
    title: "text-lg leading-snug",
    tag: "text-xs px-2 py-1",
    lines: "scale-100",
  },
};

const DEFAULT_GRADIENT = "from-violet-500 to-purple-700";

interface AICoverProps {
  title: string;
  category?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

function getGradient(category?: string): string {
  if (!category) return DEFAULT_GRADIENT;
  return (
    CATEGORY_GRADIENTS[category as CategoryKey] || DEFAULT_GRADIENT
  );
}

export function AICover({
  title,
  category,
  className,
  size = "md",
}: AICoverProps) {
  const gradient = getGradient(category);
  const sizeCls = SIZE_CLASSES[size];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-gradient-to-br",
        gradient,
        sizeCls.container,
        className
      )}
    >
      {/* Decorative geometric elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute top-2 right-2 w-8 h-8 border-2 border-white/20 rounded-full",
            sizeCls.lines
          )}
        />
        <div
          className={cn(
            "absolute -bottom-4 -left-4 w-16 h-16 border-2 border-white/10 rotate-45",
            sizeCls.lines
          )}
        />
        <div
          className={cn(
            "absolute top-1/3 left-2 w-12 h-0.5 bg-white/10",
            sizeCls.lines
          )}
        />
        <div
          className={cn(
            "absolute top-1/2 right-4 w-8 h-0.5 bg-white/10",
            sizeCls.lines
          )}
        />
        <div
          className={cn(
            "absolute bottom-1/4 left-4 w-6 h-0.5 bg-white/10 rotate-45",
            sizeCls.lines
          )}
        />
      </div>

      {/* Category tag */}
      {category && (
        <div className="absolute top-2 left-2">
          <span
            className={cn(
              "bg-black/30 backdrop-blur-sm text-white/90 rounded",
              sizeCls.tag
            )}
          >
            {category}
          </span>
        </div>
      )}

      {/* Title */}
      <div className="absolute inset-0 flex items-center justify-center p-2">
        <p
          className={cn(
            "text-white font-medium text-center line-clamp-2",
            sizeCls.title
          )}
          style={{
            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
            wordBreak: "break-word",
          }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}
