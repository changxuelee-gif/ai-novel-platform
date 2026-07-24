"use client";

import { useEffect, type ReactNode } from "react";
import { useUIStore } from "@/stores/useUIStore";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // system preference
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (systemDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  return <>{children}</>;
}
