"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SettingsActions } from "@/components/settings/SettingsActions";
import { mockUserSettings } from "@/lib/mock-data";

export default function NotificationsSettingsPage() {
  const [emailNotification, setEmailNotification] = useState(mockUserSettings.emailNotification);
  const [inAppNotification, setInAppNotification] = useState(mockUserSettings.inAppNotification);
  const [pushNotification, setPushNotification] = useState(mockUserSettings.pushNotification);

  const handleSave = () => {
    console.log("Settings saved:", {
      emailNotification, inAppNotification, pushNotification,
    });
  };

  const handleReset = () => {
    setEmailNotification(mockUserSettings.emailNotification);
    setInAppNotification(mockUserSettings.inAppNotification);
    setPushNotification(mockUserSettings.pushNotification);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <SettingsSidebar activeSection="messageNotifications" />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="space-y-8">
              <NotificationSettings
                emailNotification={emailNotification}
                onEmailNotificationChange={setEmailNotification}
                inAppNotification={inAppNotification}
                onInAppNotificationChange={setInAppNotification}
                pushNotification={pushNotification}
                onPushNotificationChange={setPushNotification}
              />
              <SettingsActions onSave={handleSave} onReset={handleReset} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
