interface ChapterWithContent {
  content: string;
  summary?: string;
}

export function buildPreviousSummary(
  chapters: ChapterWithContent[],
  maxLen: number = 400
): string {
  if (chapters.length === 0) return "";

  const recentChapters = chapters.slice(-2);
  const parts: string[] = [];

  for (const ch of recentChapters) {
    if (ch.summary && ch.summary.trim()) {
      parts.push(ch.summary.trim());
    } else if (ch.content) {
      const cleaned = ch.content.replace(/\s+/g, "").slice(0, 200);
      if (cleaned) parts.push(cleaned);
    }
  }

  const combined = parts.join("\n");
  return combined.slice(0, maxLen);
}

export function countWords(text: string): number {
  if (!text) return 0;
  return text.replace(/\s+/g, "").length;
}

export function generateChapterId(): string {
  return `ch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function extractChapterSummary(content: string, maxLen: number = 200): string {
  if (!content) return "";
  const cleaned = content.replace(/\s+/g, "");
  return cleaned.slice(0, maxLen);
}
