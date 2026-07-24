"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface AccountSettingsProps {
  nickname: string;
  onNicknameChange: (value: string) => void;
  avatar: string;
  bio: string;
  onBioChange: (value: string) => void;
}

export function AccountSettings({ nickname, onNicknameChange, avatar, bio, onBioChange }: AccountSettingsProps) {
  const t = useTranslations("settings.accountSettings");

  return (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-4">{t("title")}</h3>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <img src={avatar} alt={t("avatar")} />
          </Avatar>
          <div>
            <Button variant="outline" size="sm" className="mb-2">
              <Upload className="w-4 h-4 mr-2" />
              {t("changeAvatar")}
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, GIF. Max 2MB
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-2">{t("nickname")}</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            placeholder={t("nicknamePlaceholder")}
            className="w-full px-3 py-2 text-sm border border-border/50 rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-2">{t("bio")}</label>
          <textarea
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            placeholder={t("bioPlaceholder")}
            rows={4}
            className="w-full px-3 py-2 text-sm border border-border/50 rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
          />
        </div>
      </div>
    </div>
  );
}
