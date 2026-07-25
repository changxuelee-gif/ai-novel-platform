"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useUIStore } from "@/stores/useUIStore";
import { useLocaleStore } from "@/stores/useLocaleStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Search,
  Bell,
  Menu,
  PenSquare,
  Download,
  Sun,
  Moon,
  Monitor,
  Globe,
  ChevronDown,
  User,
  LogOut,
  BookOpen,
  Settings,
  Clock,
  LogIn,
  UserPlus,
} from "lucide-react";
import { SidebarContent } from "./Sidebar";
import { useSession, signOut } from "next-auth/react";

const locales = [
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
] as const;

export function Navbar() {
  const t = useTranslations();
  const { theme, setTheme } = useUIStore();
  const { setLocale } = useLocaleStore();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Derive current locale from URL path
  const urlLocale = pathname.split("/")[1] || "zh-CN";

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    const pathSegments = pathname.split("/");
    const supportedLocales = ["zh-CN", "zh-TW", "en", "ja", "ko"];
    if (supportedLocales.includes(pathSegments[1])) {
      pathSegments[1] = newLocale;
    } else {
      pathSegments.splice(1, 0, newLocale);
    }
    window.location.href = pathSegments.join("/") || `/${newLocale}`;
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900 text-white">
      <div className="flex h-14 items-center gap-4 px-4">
        {/* Mobile menu button */}
        <Sheet>
          <SheetTrigger
            render={
              <button className="lg:hidden inline-flex items-center justify-center rounded-md text-white hover:bg-gray-800 size-8" />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <SidebarContent isMobile />
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <PenSquare className="h-6 w-6 text-orange-400" />
          <span className="text-lg font-bold">{t("common.appName")}</span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("common.search")}
              className="pl-9 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-orange-400"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Create Center */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="hidden sm:inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm text-white hover:bg-gray-800 transition-colors" />
              }
            >
              {t("nav.createCenter")}
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <PenSquare className="mr-2 h-4 w-4" />
                {t("create.newNovel")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BookOpen className="mr-2 h-4 w-4" />
                {t("create.quickStart")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Download App */}
          <Button
            variant="outline"
            size="sm"
            className="hidden lg:flex border-gray-600 text-white hover:bg-gray-800 gap-1"
          >
            <Download className="h-4 w-4" />
            {t("common.download")}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:bg-gray-800"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-0 -right-0 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-orange-500">
              3
            </Badge>
          </Button>

          {/* Theme toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="inline-flex items-center justify-center rounded-md text-white hover:bg-gray-800 size-8 transition-colors" />
              }
            >
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Monitor className="h-5 w-5" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-white hover:bg-gray-800 transition-colors" />
              }
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">
                {locales.find((l) => l.code === urlLocale)?.label || "中文"}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {locales.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onClick={() => handleLocaleChange(l.code)}
                  className={
                    urlLocale === l.code ? "bg-primary/10 font-medium" : ""
                  }
                >
                  {l.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User section - conditional render based on auth state */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="inline-flex items-center justify-center rounded-full text-white hover:bg-gray-800 transition-colors" />
                }
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => window.location.href = "/profile"}>
                  <User className="mr-2 h-4 w-4" />
                  {t("nav.profile")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => window.location.href = "/profile/bookshelf"}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t("nav.bookshelf")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => window.location.href = "/profile/history"}>
                  <Clock className="mr-2 h-4 w-4" />
                  {t("profile.readingHistory")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => window.location.href = "/settings"}>
                  <Settings className="mr-2 h-4 w-4" />
                  {t("nav.settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("common.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800 gap-1">
                  <LogIn className="h-4 w-4" />
                  {t("common.login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white gap-1">
                  <UserPlus className="h-4 w-4" />
                  {t("common.register")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
