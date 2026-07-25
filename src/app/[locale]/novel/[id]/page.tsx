import { AppLayout } from "@/components/layout/AppLayout";
import { NovelHeader } from "@/components/novel/NovelHeader";
import { NovelTabs } from "@/components/novel/NovelTabs";
import { NovelSidebar } from "@/components/novel/NovelSidebar";
import { VoteSection } from "@/components/novel/VoteSection";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { appRouter } from "@/server/routers/_app";
import { createCallerFactory } from "@/server/trpc";
import { createContext } from "@/server/trpc/context";
import { toMockNovel, toMockChapter } from "@/lib/transformers";

const createCaller = createCallerFactory(appRouter);

interface NovelDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function NovelDetailPage({ params }: NovelDetailPageProps) {
  const { id } = await params;
  const ctx = await createContext();
  const caller = createCaller(ctx);

  try {
    const novelData = await caller.novel.getById({ id });
    const chaptersData = await caller.chapter.list({ novelId: id, limit: 100 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const novel = toMockNovel(novelData as any);
    const chapters = chaptersData.chapters.map(toMockChapter);

    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header Section */}
          <NovelHeader novel={novel} />

          <Separator className="my-6" />

          {/* Main Content + Sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <NovelTabs novel={novel} chapters={chapters} />

              <Separator className="my-6" />

              {/* Vote Section */}
              <div className="mb-8">
                <VoteSection />
              </div>
            </div>

            {/* Sidebar (desktop only) */}
            <div className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-4">
                <NovelSidebar novel={novel} />
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  } catch {
    notFound();
  }
}
