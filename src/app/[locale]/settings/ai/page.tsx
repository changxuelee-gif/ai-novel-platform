"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { AICreationLanguage } from "@/components/settings/AICreationLanguage";
import { AITranslationSettings } from "@/components/settings/AITranslationSettings";
import { SettingsActions } from "@/components/settings/SettingsActions";
import { mockUserSettings } from "@/lib/mock-data";

export default function AISettingsPage() {
  const [aiTranslationEnabled, setAiTranslationEnabled] = useState(mockUserSettings.aiTranslationEnabled);
  const [defaultTranslationTarget, setDefaultTranslationTarget] = useState(mockUserSettings.defaultTranslationTarget);
  const [creationPrimaryLanguage, setCreationPrimaryLanguage] = useState(mockUserSettings.creationPrimaryLanguage);
  const [creationAuxLanguages, setCreationAuxLanguages] = useState(mockUserSettings.creationAuxLanguages);

  const handleSave = () => {
    console.log("Settings saved:", {
      aiTranslationEnabled,
      defaultTranslationTarget,
      creationPrimaryLanguage,
      creationAuxLanguages,
    });
  };

  const handleReset = () => {
    setAiTranslationEnabled(mockUserSettings.aiTranslationEnabled);
    setDefaultTranslationTarget(mockUserSettings.defaultTranslationTarget);
    setCreationPrimaryLanguage(mockUserSettings.creationPrimaryLanguage);
    setCreationAuxLanguages(mockUserSettings.creationAuxLanguages);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <SettingsSidebar activeSection="aiAssistantSettings" />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="space-y-8">
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
              <SettingsActions onSave={handleSave} onReset={handleReset} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
