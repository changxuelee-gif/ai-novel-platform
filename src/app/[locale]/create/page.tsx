"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { WorkPanel } from "@/components/create/WorkPanel";
import { EditorArea } from "@/components/create/EditorArea";
import { AiAssistantPanel } from "@/components/create/AiAssistantPanel";
import { NewNovelDialog } from "@/components/create/NewNovelDialog";
import { PublishDialog } from "@/components/create/PublishDialog";
import { CreationModeDialog } from "@/components/create/CreationModeDialog";
import { OneClickCreation } from "@/components/create/OneClickCreation";
import { GuidedCreation } from "@/components/create/GuidedCreation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
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
    resetCreationFlow,
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

  const handleCloseCreation = useCallback(() => {
    resetCreationFlow();
  }, [resetCreationFlow]);

  // ESC key to close creation overlay
  useEffect(() => {
    if (!creationMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseCreation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [creationMode, handleCloseCreation]);

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
          {/* Close button */}
          <div className="sticky top-0 z-10 flex justify-end p-4 bg-background/80 backdrop-blur-sm border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseCreation}
              className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
              aria-label="关闭创作"
              title="关闭 (ESC)"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="max-w-4xl mx-auto w-full min-h-full -mt-14 pt-14">
            {creationMode === "oneclick" && <OneClickCreation onClose={handleCloseCreation} />}
            {creationMode === "guided" && <GuidedCreation onClose={handleCloseCreation} />}
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
