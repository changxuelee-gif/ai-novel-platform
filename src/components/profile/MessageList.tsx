"use client";

import { useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { MessageItem } from "@/lib/mock-data";

interface MessageListProps {
  messages: MessageItem[];
  onMarkAsRead: (id: string) => void;
}

export function MessageList({ messages, onMarkAsRead }: MessageListProps) {
  const t = useTranslations("profile.messagesPage");

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">{t("noMessages")}</h3>
        <p className="text-sm text-muted-foreground">{t("noMessagesDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          onClick={() => !message.isRead && onMarkAsRead(message.id)}
          className={cn(
            "flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer",
            message.isRead
              ? "bg-card border-border/50 hover:border-primary/20"
              : "bg-primary/5 border-primary/20"
          )}
        >
          <Avatar className="w-10 h-10 shrink-0">
            <img src={message.avatar} alt={message.userName} />
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-foreground">{message.userName}</span>
              {message.novelTitle && (
                <span className="text-xs text-muted-foreground">{t("onNovel", { title: message.novelTitle })}</span>
              )}
              {!message.isRead && (
                <span className="w-2 h-2 bg-red-500 rounded-full" />
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {message.content}
            </p>
            <span className="text-xs text-muted-foreground">{message.createdAt}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
