"use client";

import { WorkPanel } from "@/components/create/WorkPanel";
import { EditorArea } from "@/components/create/EditorArea";
import { AiAssistantPanel } from "@/components/create/AiAssistantPanel";
import { NewNovelDialog } from "@/components/create/NewNovelDialog";
import { PublishDialog } from "@/components/create/PublishDialog";
import { Navbar } from "@/components/layout/Navbar";

export default function CreatePage() {
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

      <NewNovelDialog />
      <PublishDialog />
    </div>
  );
}
