"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { WorkPanel } from "@/components/create/WorkPanel";
import { EditorArea } from "@/components/create/EditorArea";
import { AiAssistantPanel } from "@/components/create/AiAssistantPanel";
import { NewNovelDialog } from "@/components/create/NewNovelDialog";
import { PublishDialog } from "@/components/create/PublishDialog";
import { CreationModeDialog } from "@/components/create/CreationModeDialog";
import { OneClickCreation } from "@/components/create/OneClickCreation";
import { GuidedCreation } from "@/components/create/GuidedCreation";
import { Navbar } from "@/components/layout/Navbar";
import { useCreateStore } from "@/stores/useCreateStore";

export default function CreatePage() {
  const searchParams = useSearchParams();
  const {
    creationMode,
    creationModeDialogOpen,
    setCreationModeDialogOpen,
    setCreationMode,
    setCreationStep,
    setNewNovelDialogOpen,
  } = useCreateStore();

  useEffect(() => {
    if (searchParams.get("ai") === "true") {
      setCreationModeDialogOpen(true);
    }
  }, [searchParams, setCreationModeDialogOpen]);

  const handleSelectMode = (mode: "oneclick" | "guided" | "manual") => {
    if (mode === "manual") {
      setNewNovelDialogOpen(true);
    } else {
      setCreationMode(mode);
      setCreationStep(mode === "oneclick" ? 0 : 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:block w-60 shrink-0 border-r bg-card overflow-y-auto">
          <WorkPanel />
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <EditorArea />
        </main>

        <aside className="hidden lg:block w-80 shrink-0 border-l bg-background overflow-y-auto">
          <AiAssistantPanel />
        </aside>
      </div>

      {/* AI创作全屏overlay */}
      {creationMode !== null && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-auto">
          <div className="max-w-4xl mx-auto w-full min-h-full">
            {creationMode === "oneclick" && <OneClickCreation />}
            {creationMode === "guided" && <GuidedCreation />}
          </div>
        </div>
      )}

      <NewNovelDialog />
      <PublishDialog />
      <CreationModeDialog
        open={creationModeDialogOpen}
        onClose={() => setCreationModeDialogOpen(false)}
        onSelectMode={handleSelectMode}
      />
    </div>
  );
}
