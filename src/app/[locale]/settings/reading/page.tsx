"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { ReadingPreferences } from "@/components/settings/ReadingPreferences";
import { SettingsActions } from "@/components/settings/SettingsActions";
import { mockUserSettings } from "@/lib/mock-data";

export default function ReadingSettingsPage() {
  const [fontSize, setFontSize] = useState(mockUserSettings.fontSize);
  const [lineHeight, setLineHeight] = useState(mockUserSettings.lineHeight);
  const [bgColor, setBgColor] = useState(mockUserSettings.bgColor);

  const handleSave = () => {
    console.log("Settings saved:", {
      fontSize, lineHeight, bgColor,
    });
  };

  const handleReset = () => {
    setFontSize(mockUserSettings.fontSize);
    setLineHeight(mockUserSettings.lineHeight);
    setBgColor(mockUserSettings.bgColor);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <SettingsSidebar activeSection="readingPreferences" />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="space-y-8">
              <ReadingPreferences
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                lineHeight={lineHeight}
                onLineHeightChange={setLineHeight}
                bgColor={bgColor}
                onBgColorChange={setBgColor}
              />
              <SettingsActions onSave={handleSave} onReset={handleReset} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
