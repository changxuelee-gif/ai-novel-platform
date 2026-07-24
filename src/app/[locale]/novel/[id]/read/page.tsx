"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useReaderStore } from "@/stores/useReaderStore";
import { ReaderToolbar } from "@/components/reader/ReaderToolbar";
import { ReaderSettings } from "@/components/reader/ReaderSettings";
import { ChapterNav } from "@/components/reader/ChapterNav";
import { CommentPanel } from "@/components/reader/CommentPanel";
import { InteractiveChoiceCard } from "@/components/reader/InteractiveChoice";
import {
  getChaptersByNovelId,
  getNovelById,
  mockInteractiveChoices,
} from "@/lib/mock-data";

const bgColorMap: Record<string, { bg: string; text: string }> = {
  day: { bg: "#ffffff", text: "#1a1a1a" },
  night: { bg: "#1a1a2e", text: "#d4d4d8" },
  eye: { bg: "#f5f5dc", text: "#5b5b3a" },
  parchment: { bg: "#f4e4c1", text: "#6b5b3a" },
};

export default function ReadPage() {
  useTranslations("novel.read");
  const params = useParams();
  const novelId = params.id as string;

  const { settings } = useReaderStore();

  const novel = getNovelById(novelId);
  const chapters = getChaptersByNovelId(novelId);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const currentChapter = chapters[currentChapterIndex] || chapters[0];

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const [mobileCommentOpen, setMobileCommentOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const totalChapters = chapters.length;
  const hasPrev = currentChapterIndex > 0;
  const hasNext = currentChapterIndex < totalChapters - 1;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrev) handlePrev();
      if (e.key === "ArrowRight" && hasNext) handleNext();
      if (e.key === "Escape") {
        setSettingsOpen(false);
        setMobileCatalogOpen(false);
        setMobileCommentOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasPrev, hasNext, currentChapterIndex]);

  const handlePrev = () => {
    if (hasPrev) {
      setCurrentChapterIndex((i) => i - 1);
      contentRef.current?.scrollTo({ top: 0 });
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setCurrentChapterIndex((i) => i + 1);
      contentRef.current?.scrollTo({ top: 0 });
    }
  };

  const handleChapterSelect = (chapterId: string) => {
    const idx = chapters.findIndex((c) => c.id === chapterId);
    if (idx !== -1) {
      setCurrentChapterIndex(idx);
      setMobileCatalogOpen(false);
      contentRef.current?.scrollTo({ top: 0 });
    }
  };

  const currentBg = bgColorMap[settings.bgColor] || bgColorMap.day;

  const interactiveChoice = mockInteractiveChoices.find(
    (c) => c.chapterId === currentChapter.id
  );

  // Mobile toolbar buttons
  const MobileToolbarButtons = () => (
    <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 flex justify-center gap-4 pb-2">
      <button
        onClick={() => setMobileCatalogOpen(true)}
        className="px-4 py-2 bg-card/90 backdrop-blur-sm rounded-full border border-border/50 text-xs text-foreground shadow-lg"
      >
        目录
      </button>
      <button
        onClick={() => setMobileCommentOpen(true)}
        className="px-4 py-2 bg-card/90 backdrop-blur-sm rounded-full border border-border/50 text-xs text-foreground shadow-lg"
      >
        评论
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: currentBg.bg, color: currentBg.text }}>
      {/* Three Column Layout (desktop) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Chapter Nav (desktop) */}
        <div className="hidden lg:block w-72 shrink-0">
          {novel && (
            <ChapterNav
              novel={novel}
              chapters={chapters}
              currentChapterId={currentChapter.id}
              onSelect={handleChapterSelect}
            />
          )}
        </div>

        {/* Center - Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: currentBg.bg }}
        >
          <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 lg:py-20">
            {/* Chapter Title */}
            <h1
              className="text-xl md:text-2xl font-bold mb-8 text-center"
              style={{ color: currentBg.text }}
            >
              {currentChapter.title}
            </h1>

            {/* Chapter Content */}
            <div
              className="leading-relaxed"
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
                color: currentBg.text,
              }}
            >
              {currentChapter.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="mb-4" style={{ textIndent: "2em" }}>
                  {paragraph.trim()}
                </p>
              ))}
            </div>

            {/* Interactive Choice */}
            {interactiveChoice && (
              <InteractiveChoiceCard
                choice={interactiveChoice}
                onChoice={(optionId) => {
                  const target = interactiveChoice.options.find((o) => o.id === optionId);
                  if (target) handleChapterSelect(target.targetChapterId);
                }}
              />
            )}

            {/* Bottom spacer */}
            <div className="h-24" />
          </div>
        </div>

        {/* Right Panel - Comments (desktop) */}
        <div className="hidden lg:block w-72 shrink-0">
          <CommentPanel />
        </div>
      </div>

      {/* Mobile Toolbar */}
      <MobileToolbarButtons />

      {/* Bottom Toolbar */}
      <ReaderToolbar
        novelId={novelId}
        chapterOrder={currentChapter.order}
        totalChapters={totalChapters}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={handlePrev}
        onNext={handleNext}
        onToggleSettings={() => setSettingsOpen(true)}
      />

      {/* Settings Sheet */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[80vh] p-0">
          <div className="p-4">
            <ReaderSettings />
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Catalog Sheet */}
      <Sheet open={mobileCatalogOpen} onOpenChange={setMobileCatalogOpen}>
        <SheetContent side="left" className="w-80 p-0">
          {novel && (
            <ChapterNav
              novel={novel}
              chapters={chapters}
              currentChapterId={currentChapter.id}
              onSelect={handleChapterSelect}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Mobile Comment Sheet */}
      <Sheet open={mobileCommentOpen} onOpenChange={setMobileCommentOpen}>
        <SheetContent side="right" className="w-80 p-0">
          <CommentPanel />
        </SheetContent>
      </Sheet>
    </div>
  );
}
