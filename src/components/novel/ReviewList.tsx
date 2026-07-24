"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageCircle, Star, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types";
import { mockComments } from "@/lib/mock-data";

function ReviewItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const t = useTranslations("novel");
  const [showReplies, setShowReplies] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className={cn(depth > 0 && "ml-8 pl-4 border-l-2 border-border/50")}>
      <div className="py-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-9 h-9 shrink-0">
            <img src={comment.userAvatar} alt={comment.userName} />
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-foreground">
                {comment.userName}
              </span>
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                书友
              </Badge>
              <div className="flex items-center gap-0.5 ml-auto text-xs text-muted-foreground">
                {comment.createdAt}
              </div>
            </div>

            {/* Star rating for first-level comments */}
            {depth === 0 && (
              <div className="flex items-center gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3.5 h-3.5",
                      i <= 4
                        ? "text-amber-400 fill-amber-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
            )}

            <p className="text-sm text-foreground leading-relaxed mb-2">
              {comment.content}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1 text-xs transition-colors",
                  liked
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ThumbsUp className={cn("w-3.5 h-3.5", liked && "fill-current")} />
                {likeCount} {t("likes")}
              </button>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
                {t("reply")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div>
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-xs text-primary mb-2 ml-12"
          >
            {showReplies ? (
              <>
                {t("collapse")}
                <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                {comment.replies.length} 条回复
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
          {showReplies &&
            comment.replies.map((reply) => (
              <ReviewItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
        </div>
      )}
    </div>
  );
}

export function ReviewList() {
  const t = useTranslations("novel");

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          {t("reviews")}
        </h3>
        <button className="text-sm text-primary hover:underline">
          {t("viewAllReviews", { count: 1247 })}
        </button>
      </div>

      <div className="divide-y divide-border/50">
        {mockComments.map((comment) => (
          <ReviewItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
