import { AppLayout } from "@/components/layout/AppLayout";
import { NovelHeader } from "@/components/novel/NovelHeader";
import { NovelTabs } from "@/components/novel/NovelTabs";
import { NovelSidebar } from "@/components/novel/NovelSidebar";
import { VoteSection } from "@/components/novel/VoteSection";
import { Separator } from "@/components/ui/separator";
import {
  getNovelById,
  getChaptersByNovelId,
} from "@/lib/mock-data";
import { notFound } from "next/navigation";

interface NovelDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function NovelDetailPage({ params }: NovelDetailPageProps) {
  const { id } = await params;
  const novel = getNovelById(id);

  if (!novel) {
    notFound();
  }

  const chapters = getChaptersByNovelId(id);

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
}
