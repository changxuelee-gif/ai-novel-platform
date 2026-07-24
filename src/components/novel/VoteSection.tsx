"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { VoteOption } from "@/types";
import { mockVoteOptions } from "@/lib/mock-data";

export function VoteSection() {
  const t = useTranslations("novel");
  const [selected, setSelected] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);

  const totalVotes = mockVoteOptions.reduce((s, o) => s + o.votes, 0);

  const handleVote = (optionId: string) => {
    if (voted) return;
    setSelected(optionId);
    setVoted(true);
  };

  return (
    <div className="bg-muted/30 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-foreground">
          {t("voteQuestion")}
        </h3>
        <span className="text-xs text-muted-foreground">
          {t("participants", { count: totalVotes.toLocaleString() })}
        </span>
      </div>

      <div className="space-y-3">
        {mockVoteOptions.map((option: VoteOption) => {
          const isSelected = selected === option.id;
          const displayPercentage = voted ? option.percentage : 0;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={voted}
              className={cn(
                "w-full text-left relative rounded-lg overflow-hidden transition-all",
                voted ? "cursor-default" : "cursor-pointer hover:ring-2 hover:ring-primary/30"
              )}
            >
              {/* Progress bar background */}
              <div
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-out",
                  isSelected
                    ? "bg-primary/15"
                    : "bg-muted"
                )}
                style={{ width: voted ? `${displayPercentage}%` : "0%" }}
              />

              <div className="relative flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-sm text-foreground">{option.label}</span>
                </div>
                {voted && (
                  <span className="text-sm font-medium text-primary">
                    {displayPercentage}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
