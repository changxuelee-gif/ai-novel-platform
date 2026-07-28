"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { SettingsActions } from "@/components/settings/SettingsActions";
import { mockUserSettings } from "@/lib/mock-data";

export default function PrivacySettingsPage() {
  const [defaultVisibility, setDefaultVisibility] = useState<"public" | "private">(mockUserSettings.defaultVisibility);
  const [commentPermission, setCommentPermission] = useState<"all" | "followers" | "none">(mockUserSettings.commentPermission);

  const handleSave = () => {
    console.log("Settings saved:", {
      defaultVisibility, commentPermission,
    });
  };

  const handleReset = () => {
    setDefaultVisibility(mockUserSettings.defaultVisibility);
    setCommentPermission(mockUserSettings.commentPermission);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <SettingsSidebar activeSection="privacySettings" />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="space-y-8">
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
