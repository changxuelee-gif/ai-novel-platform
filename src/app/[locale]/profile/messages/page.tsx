"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { MessageTabs } from "@/components/profile/MessageTabs";
import { MessageList } from "@/components/profile/MessageList";
import { trpc } from "@/trpc/client";
import { Bell } from "lucide-react";

type MessageTabType = "system" | "comment" | "like";

const defaultUser = {
  id: "",
  name: "用户",
  avatar: "",
  vip: false,
  bio: "",
  following: 0,
  followers: 0,
  works: 0,
  banner: "",
};

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<MessageTabType>("system");

  const { data: userData } = trpc.user.getProfile.useQuery();

  const user = userData
    ? {
        ...defaultUser,
        id: userData.id,
        name: userData.name ?? "用户",
        avatar: userData.avatar ?? userData.image ?? "",
        vip: userData.role === "VERIFIED" || userData.role === "AUTHOR",
        bio: userData.bio ?? "",
        following: userData._count?.following ?? 0,
        followers: userData._count?.followers ?? 0,
        works: userData._count?.novels ?? 0,
      }
    : defaultUser;

  const assets = {
    coins: userData?.coins ?? 0,
    membershipExpiry: "",
  };

  // TODO: Replace with real notification API when available
  const messages: Array<{
    id: string;
    type: "system" | "comment" | "like";
    avatar: string;
    userName: string;
    content: string;
    novelTitle?: string;
    createdAt: string;
    isRead: boolean;
  }> = [];

  const filteredMessages = messages.filter((msg) => msg.type === activeTab);

  const unreadCounts = {
    system: messages.filter((m) => m.type === "system" && !m.isRead).length,
    comment: messages.filter((m) => m.type === "comment" && !m.isRead).length,
    like: messages.filter((m) => m.type === "like" && !m.isRead).length,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMarkAsRead = (_id?: string) => {
    // TODO: call API to mark as read
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <ProfileSidebar user={user} assets={assets} />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">消息通知</h1>
            </div>
            <MessageTabs activeTab={activeTab} onTabChange={setActiveTab} counts={unreadCounts} />
            <MessageList messages={filteredMessages} onMarkAsRead={handleMarkAsRead} />
            {filteredMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">暂无新消息</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
