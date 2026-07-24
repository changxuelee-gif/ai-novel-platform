"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ReaderSettings } from "@/types";

interface ReaderState {
  settings: ReaderSettings;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setBgColor: (color: ReaderSettings["bgColor"]) => void;
  setPageMode: (mode: ReaderSettings["pageMode"]) => void;
  resetSettings: () => void;
}

const defaultSettings: ReaderSettings = {
  fontSize: 16,
  lineHeight: 1.8,
  bgColor: "day",
  pageMode: "scroll",
};

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      setFontSize: (fontSize) =>
        set((state) => ({
          settings: { ...state.settings, fontSize },
        })),
      setLineHeight: (lineHeight) =>
        set((state) => ({
          settings: { ...state.settings, lineHeight },
        })),
      setBgColor: (bgColor) =>
        set((state) => ({
          settings: { ...state.settings, bgColor },
        })),
      setPageMode: (pageMode) =>
        set((state) => ({
          settings: { ...state.settings, pageMode },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: "reader-store",
    }
  )
);
