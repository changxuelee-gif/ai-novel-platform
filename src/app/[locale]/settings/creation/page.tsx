"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { AICreationLanguage } from "@/components/settings/AICreationLanguage";
import { SettingsActions } from "@/components/settings/SettingsActions";
import { mockUserSettings } from "@/lib/mock-data";
import { PenTool, BookOpen, Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const defaultGenreOptions = [
  { value: "fantasy", label: "奇幻" },
  { value: "romance", label: "言情" },
  { value: "scifi", label: "科幻" },
  { value: "mystery", label: "悬疑" },
  { value: "history", label: "历史" },
  { value: "modern", label: "现代" },
];

const aiAssistanceLevelOptions = [
  { value: "off", label: "关闭", desc: "不使用AI辅助" },
  { value: "minimal", label: "基础", desc: "仅语法和拼写检查" },
  { value: "standard", label: "标准", desc: "情节建议和润色" },
  { value: "full", label: "全面", desc: "AI深度辅助创作" },
];

export default function CreationSettingsPage() {
  const [creationPrimaryLanguage, setCreationPrimaryLanguage] = useState(mockUserSettings.creationPrimaryLanguage);
  const [creationAuxLanguages, setCreationAuxLanguages] = useState(mockUserSettings.creationAuxLanguages);
  const [defaultGenre, setDefaultGenre] = useState("fantasy");
  const [aiAssistanceLevel, setAiAssistanceLevel] = useState("standard");
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [wordCountGoal, setWordCountGoal] = useState(2000);

  const handleSave = () => {
    console.log("Settings saved:", {
      creationPrimaryLanguage,
      creationAuxLanguages,
      defaultGenre,
      aiAssistanceLevel,
      autoSaveEnabled,
      wordCountGoal,
    });
  };

  const handleReset = () => {
    setCreationPrimaryLanguage(mockUserSettings.creationPrimaryLanguage);
    setCreationAuxLanguages(mockUserSettings.creationAuxLanguages);
    setDefaultGenre("fantasy");
    setAiAssistanceLevel("standard");
    setAutoSaveEnabled(true);
    setWordCountGoal(2000);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <SettingsSidebar activeSection="creationPreferences" />

        <div className="flex-1 min-w-0">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-primary" />
                  创作偏好
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  自定义您的创作环境和默认设置，提升创作效率
                </p>
              </div>

              <AICreationLanguage
                primaryLanguage={creationPrimaryLanguage}
                onPrimaryLanguageChange={setCreationPrimaryLanguage}
                auxLanguages={creationAuxLanguages}
                onAuxLanguagesChange={setCreationAuxLanguages}
              />

              <div>
                <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  默认创作类型
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {defaultGenreOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDefaultGenre(option.value)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm border transition-all",
                        defaultGenre === option.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border/50 text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-medium text-foreground">AI辅助等级</h4>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {aiAssistanceLevelOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAiAssistanceLevel(option.value)}
                      className={cn(
                        "p-3 rounded-lg border transition-all text-left",
                        aiAssistanceLevel === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border/50 hover:border-primary/30"
                      )}
                    >
                      <div className={cn(
                        "text-sm font-medium mb-1",
                        aiAssistanceLevel === option.value ? "text-primary" : "text-foreground"
                      )}>
                        {option.label}
                      </div>
                      <div className="text-xs text-muted-foreground">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 rounded-lg">
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  创作偏好设置将应用于您的所有新作品。您可以在创建具体作品时单独调整这些设置。
                </p>
              </div>

              <SettingsActions onSave={handleSave} onReset={handleReset} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
