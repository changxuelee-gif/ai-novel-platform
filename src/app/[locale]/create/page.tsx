"use client";

import { WorkPanel } from "@/components/create/WorkPanel";
import { EditorArea } from "@/components/create/EditorArea";
import { AiAssistantPanel } from "@/components/create/AiAssistantPanel";
import { NewNovelDialog } from "@/components/create/NewNovelDialog";
import { PublishDialog } from "@/components/create/PublishDialog";

export default function CreatePage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* 左侧：作品与章节管理 (240px) */}
      <aside className="hidden lg:block w-60 shrink-0 border-r bg-sidebar overflow-y-auto">
        <WorkPanel />
      </aside>

      {/* 中间：富文本编辑器 (弹性) */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <EditorArea />
      </main>

      {/* 右侧：AI 创作助手 (320px) */}
      <aside className="hidden lg:block w-80 shrink-0 border-l bg-background overflow-y-auto">
        <AiAssistantPanel />
      </aside>

      {/* 弹窗 */}
      <NewNovelDialog />
      <PublishDialog />
    </div>
  );
}
