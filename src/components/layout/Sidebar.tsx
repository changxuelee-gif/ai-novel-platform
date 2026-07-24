"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useUIStore } from "@/stores/useUIStore";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Home,
  PenSquare,
  Users,
  Palette,
  Gamepad2,
  Target,
  PartyPopper,
  Trophy,
  Tags,
  BookOpen,
  Clock,
  FileText,
} from "lucide-react";

const mainNavItems = [
  { href: "/", icon: Home, labelKey: "nav.home" },
  { href: "/create", icon: PenSquare, labelKey: "nav.quickCreate" },
] as const;

const exploreItems = [
  { href: "/explore/characters", icon: Users, labelKey: "nav.characters" },
  { href: "/explore/styles", icon: Palette, labelKey: "nav.styles" },
  { href: "/novel/interactive", icon: Gamepad2, labelKey: "nav.interactiveNovel" },
  { href: "/tasks", icon: Target, labelKey: "nav.taskCenter" },
  { href: "/activities", icon: PartyPopper, labelKey: "nav.activityCenter" },
  { href: "/ranking", icon: Trophy, labelKey: "nav.ranking" },
  { href: "/tags", icon: Tags, labelKey: "nav.allTags" },
] as const;

const myItems = [
  { href: "/profile/bookshelf", icon: BookOpen, labelKey: "nav.bookshelf" },
  { href: "/profile/history", icon: Clock, labelKey: "nav.history" },
  { href: "/profile/works", icon: FileText, labelKey: "nav.myWorks" },
] as const;

interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon: Icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export function SidebarContent({ isMobile = false }: { isMobile?: boolean }) {
  const t = useTranslations();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex flex-col h-full">
      {/* Mobile header */}
      {isMobile && (
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          <PenSquare className="h-5 w-5 text-orange-400" />
          <span className="font-bold">{t("common.appName")}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Main navigation */}
        {mainNavItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={t(item.labelKey)}
            isActive={isActive(item.href)}
          />
        ))}

        <Separator className="my-3" />

        {/* Explore section */}
        <div className="px-3 py-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("nav.explore")}
          </span>
        </div>
        {exploreItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={t(item.labelKey)}
            isActive={isActive(item.href)}
          />
        ))}

        <Separator className="my-3" />

        {/* My section */}
        <div className="px-3 py-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("nav.my")}
          </span>
        </div>
        {myItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={t(item.labelKey)}
            isActive={isActive(item.href)}
          />
        ))}
      </div>
    </nav>
  );
}

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  if (!sidebarOpen) return null;

  return (
    <aside className="hidden lg:block w-60 shrink-0 border-r bg-sidebar text-sidebar-foreground">
      <SidebarContent />
    </aside>
  );
}
