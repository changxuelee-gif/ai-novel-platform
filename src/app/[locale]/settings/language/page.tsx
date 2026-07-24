"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { AITranslationSettings } from "@/components/settings/AITranslationSettings";
import { AICreationLanguage } from "@/components/settings/AICreationLanguage";
import { RegionTimezone } from "@/components/settings/RegionTimezone";
import { SettingsActions } from "@/components/settings/SettingsActions";
import { mockUserSettings } from "@/lib/mock-data";

export default function LanguageSettingsPage() {
  const [interfaceLanguage, setInterfaceLanguage] = useState(mockUserSettings.interfaceLanguage);
  const [aiTranslationEnabled, setAiTranslationEnabled] = useState(mockUserSettings.aiTranslationEnabled);
  const [defaultTranslationTarget, setDefaultTranslationTarget] = useState(mockUserSettings.defaultTranslationTarget);
  const [creationPrimaryLanguage, setCreationPrimaryLanguage] = useState(mockUserSettings.creationPrimaryLanguage);
  const [creationAuxLanguages, setCreationAuxLanguages] = useState(mockUserSettings.creationAuxLanguages);
  const [region, setRegion] = useState(mockUserSettings.region);
  const [timezone, setTimezone] = useState(mockUserSettings.timezone);

  const handleSave = () => {
    console.log("Settings saved:", {
      interfaceLanguage,
      aiTranslationEnabled,
      defaultTranslationTarget,
      creationPrimaryLanguage,
      creationAuxLanguages,
      region,
      timezone,
    });
  };

  const handleReset = () => {
    setInterfaceLanguage(mockUserSettings.interfaceLanguage);
    setAiTranslationEnabled(mockUserSettings.aiTranslationEnabled);
    setDefaultTranslationTarget(mockUserSettings.defaultTranslationTarget);
    setCreationPrimaryLanguage(mockUserSettings.creationPrimaryLanguage);
    setCreationAuxLanguages(mockUserSettings.creationAuxLanguages);
    setRegion(mockUserSettings.region);
    setTimezone(mockUserSettings.timezone);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <SettingsSidebar activeSection="languageSettings" />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="space-y-8">
              <LanguageSelector selected={interfaceLanguage} onSelect={setInterfaceLanguage} />
              <AITranslationSettings
                enabled={aiTranslationEnabled}
                onToggle={() => setAiTranslationEnabled(!aiTranslationEnabled)}
                targetLanguage={defaultTranslationTarget}
                onTargetLanguageChange={setDefaultTranslationTarget}
              />
              <AICreationLanguage
                primaryLanguage={creationPrimaryLanguage}
                onPrimaryLanguageChange={setCreationPrimaryLanguage}
                auxLanguages={creationAuxLanguages}
                onAuxLanguagesChange={setCreationAuxLanguages}
              />
              <RegionTimezone
                region={region}
                onRegionChange={setRegion}
                timezone={timezone}
                onTimezoneChange={setTimezone}
              />
              <SettingsActions onSave={handleSave} onReset={handleReset} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
