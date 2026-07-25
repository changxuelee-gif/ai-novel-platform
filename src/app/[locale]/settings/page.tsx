"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { ReadingPreferences } from "@/components/settings/ReadingPreferences";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { SettingsActions } from "@/components/settings/SettingsActions";
import { trpc } from "@/trpc/client";

export default function SettingsPage() {
  const { data: userData } = trpc.user.getProfile.useQuery();

  const [nickname, setNickname] = useState(userData?.name ?? "");
  const [bio, setBio] = useState(userData?.bio ?? "");
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [bgColor, setBgColor] = useState("day");
  const [emailNotification, setEmailNotification] = useState(true);
  const [inAppNotification, setInAppNotification] = useState(true);
  const [pushNotification, setPushNotification] = useState(false);
  const [defaultVisibility, setDefaultVisibility] = useState<"public" | "private">("public");
  const [commentPermission, setCommentPermission] = useState<"all" | "followers" | "none">("all");

  const handleSave = () => {
    console.log("Settings saved:", {
      nickname, bio, fontSize, lineHeight, bgColor,
      emailNotification, inAppNotification, pushNotification,
      defaultVisibility, commentPermission,
    });
  };

  const handleReset = () => {
    setNickname(userData?.name ?? "");
    setBio(userData?.bio ?? "");
    setFontSize(16);
    setLineHeight(1.8);
    setBgColor("day");
    setEmailNotification(true);
    setInAppNotification(true);
    setPushNotification(false);
    setDefaultVisibility("public");
    setCommentPermission("all");
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <SettingsSidebar activeSection="personalInfo" />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="space-y-8">
              <AccountSettings
                nickname={nickname}
                onNicknameChange={setNickname}
                avatar={userData?.avatar ?? userData?.image ?? ""}
                bio={bio}
                onBioChange={setBio}
              />
              <ReadingPreferences
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                lineHeight={lineHeight}
                onLineHeightChange={setLineHeight}
                bgColor={bgColor}
                onBgColorChange={setBgColor}
              />
              <NotificationSettings
                emailNotification={emailNotification}
                onEmailNotificationChange={setEmailNotification}
                inAppNotification={inAppNotification}
                onInAppNotificationChange={setInAppNotification}
                pushNotification={pushNotification}
                onPushNotificationChange={setPushNotification}
              />
              <PrivacySettings
                defaultVisibility={defaultVisibility}
                onDefaultVisibilityChange={setDefaultVisibility}
                commentPermission={commentPermission}
                onCommentPermissionChange={setCommentPermission}
              />
              <SettingsActions onSave={handleSave} onReset={handleReset} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
