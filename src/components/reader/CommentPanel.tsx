"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send, ThumbsUp } from "lucide-react";
import { mockComments } from "@/lib/mock-data";
import { VoteSection } from "@/components/novel/VoteSection";

export function CommentPanel() {
  const [comment, setComment] = useState("");

  return (
    <div className="h-full flex flex-col bg-card border-l border-border/50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50">
        <h3 className="text-sm font-medium text-foreground">评论互动</h3>
      </div>

      {/* Comment List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {mockComments.map((c) => (
          <div key={c.id} className="flex gap-2.5">
            <Avatar className="w-7 h-7 shrink-0">
              <img src={c.userAvatar} alt={c.userName} />
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-foreground">{c.userName}</span>
                <span className="text-[10px] text-muted-foreground">{c.createdAt}</span>
              </div>
              <p className="text-xs text-foreground leading-relaxed mt-0.5">{c.content}</p>
              <div className="flex items-center gap-2 mt-1">
                <button className="flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground">
                  <ThumbsUp className="w-3 h-3" />
                  {c.likes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vote Section */}
      <div className="px-3 py-2 border-t border-border/50">
        <VoteSection />
      </div>

      {/* Comment Input */}
      <div className="p-3 border-t border-border/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="写下你的评论..."
            className="flex-1 px-3 py-2 text-xs bg-muted rounded-lg border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          <Button size="icon" className="h-8 w-8 shrink-0" disabled={!comment.trim()}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
