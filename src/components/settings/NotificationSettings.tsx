"use client";

import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { Mail, Bell, Smartphone } from "lucide-react";

interface NotificationSettingsProps {
  emailNotification: boolean;
  onEmailNotificationChange: (value: boolean) => void;
  inAppNotification: boolean;
  onInAppNotificationChange: (value: boolean) => void;
  pushNotification: boolean;
  onPushNotificationChange: (value: boolean) => void;
}

export function NotificationSettings({ emailNotification, onEmailNotificationChange, inAppNotification, onInAppNotificationChange, pushNotification, onPushNotificationChange }: NotificationSettingsProps) {
  const t = useTranslations("settings.notificationSettings");

  return (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-4">{t("title")}</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">{t("emailNotification")}</div>
              <div className="text-xs text-muted-foreground">{t("emailNotificationDesc")}</div>
            </div>
          </div>
          <Switch checked={emailNotification} onCheckedChange={onEmailNotificationChange} />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">{t("inAppNotification")}</div>
              <div className="text-xs text-muted-foreground">{t("inAppNotificationDesc")}</div>
            </div>
          </div>
          <Switch checked={inAppNotification} onCheckedChange={onInAppNotificationChange} />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">{t("pushNotification")}</div>
              <div className="text-xs text-muted-foreground">{t("pushNotificationDesc")}</div>
            </div>
          </div>
          <Switch checked={pushNotification} onCheckedChange={onPushNotificationChange} />
        </div>
      </div>
    </div>
  );
}
