"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { ReadingPreferences } from "@/components/settings/ReadingPreferences";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { SettingsActions } from "@/components/settings/SettingsActions";
import { mockUserSettings } from "@/lib/mock-data";

export default function SettingsPage() {
  const [nickname, setNickname] = useState(mockUserSettings.nickname);
  const [bio, setBio] = useState(mockUserSettings.bio);
  const [fontSize, setFontSize] = useState(mockUserSettings.fontSize);
  const [lineHeight, setLineHeight] = useState(mockUserSettings.lineHeight);
  const [bgColor, setBgColor] = useState(mockUserSettings.bgColor);
  const [emailNotification, setEmailNotification] = useState(mockUserSettings.emailNotification);
  const [inAppNotification, setInAppNotification] = useState(mockUserSettings.inAppNotification);
  const [pushNotification, setPushNotification] = useState(mockUserSettings.pushNotification);
  const [defaultVisibility, setDefaultVisibility] = useState<"public" | "private">(mockUserSettings.defaultVisibility);
  const [commentPermission, setCommentPermission] = useState<"all" | "followers" | "none">(mockUserSettings.commentPermission);

  const handleSave = () => {
    console.log("Settings saved:", {
      nickname, bio, fontSize, lineHeight, bgColor,
      emailNotification, inAppNotification, pushNotification,
      defaultVisibility, commentPermission,
    });
  };

  const handleReset = () => {
    setNickname(mockUserSettings.nickname);
    setBio(mockUserSettings.bio);
    setFontSize(mockUserSettings.fontSize);
    setLineHeight(mockUserSettings.lineHeight);
    setBgColor(mockUserSettings.bgColor);
    setEmailNotification(mockUserSettings.emailNotification);
    setInAppNotification(mockUserSettings.inAppNotification);
    setPushNotification(mockUserSettings.pushNotification);
    setDefaultVisibility(mockUserSettings.defaultVisibility);
    setCommentPermission(mockUserSettings.commentPermission);
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
                avatar={mockUserSettings.avatar}
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
