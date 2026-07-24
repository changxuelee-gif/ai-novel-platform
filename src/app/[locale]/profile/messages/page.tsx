"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { MessageTabs } from "@/components/profile/MessageTabs";
import { MessageList } from "@/components/profile/MessageList";
import { mockUserProfile, mockUserAssets, mockMessages } from "@/lib/mock-data";
import type { MessageItem } from "@/lib/mock-data";

type MessageTabType = "system" | "comment" | "like";

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<MessageTabType>("system");
  const [messages, setMessages] = useState<MessageItem[]>(mockMessages);

  const filteredMessages = messages.filter((msg) => msg.type === activeTab);

  const unreadCounts = {
    system: messages.filter((m) => m.type === "system" && !m.isRead).length,
    comment: messages.filter((m) => m.type === "comment" && !m.isRead).length,
    like: messages.filter((m) => m.type === "like" && !m.isRead).length,
  };

  const handleMarkAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
    );
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <ProfileSidebar user={mockUserProfile} assets={mockUserAssets} />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <MessageTabs activeTab={activeTab} onTabChange={setActiveTab} counts={unreadCounts} />
            <MessageList messages={filteredMessages} onMarkAsRead={handleMarkAsRead} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
