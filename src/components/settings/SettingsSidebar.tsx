"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  User, Shield, Globe, BookOpen, Bell, Lock, Sparkles, PenTool,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsSidebarProps {
  activeSection: string;
}

const navItems = [
  { href: "/settings", icon: User, labelKey: "settings.sidebar.personalInfo" },
  { href: "/settings/security", icon: Shield, labelKey: "settings.sidebar.accountSecurity" },
  { href: "/settings/language", icon: Globe, labelKey: "settings.sidebar.languageSettings" },
  { href: "/settings/reading", icon: BookOpen, labelKey: "settings.sidebar.readingPreferences" },
  { href: "/settings/notifications", icon: Bell, labelKey: "settings.sidebar.messageNotifications" },
  { href: "/settings/privacy", icon: Lock, labelKey: "settings.sidebar.privacySettings" },
  { href: "/settings/ai", icon: Sparkles, labelKey: "settings.sidebar.aiAssistantSettings" },
  { href: "/settings/creation", icon: PenTool, labelKey: "settings.sidebar.creationPreferences" },
];

export function SettingsSidebar({ activeSection }: SettingsSidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <div className="w-64 shrink-0 bg-card border-r border-border/50 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold text-foreground mb-4">{t("settings.title")}</h2>
      </div>

      <div className="px-2 pb-4">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href.split("/")[1]) || 
            (activeSection && item.labelKey.includes(activeSection));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{t(item.labelKey)}</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
