import { AppLayout } from "@/components/layout/AppLayout";
import { AuthorHeader } from "@/components/author/AuthorHeader";
import { AuthorReviews } from "@/components/author/AuthorReviews";
import { AuthorTabContent } from "./AuthorTabContent";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { appRouter } from "@/server/routers/_app";
import { createCallerFactory } from "@/server/trpc";
import { createContext } from "@/server/trpc/context";

const createCaller = createCallerFactory(appRouter);

interface AuthorPageProps {
  params: Promise<{ id: string }>;
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params;
  const ctx = await createContext();
  const caller = createCaller(ctx);

  try {
    const user = await caller.user.getById({ id });

    const works = await caller.novel.list({
      page: 1,
      limit: 20,
      authorId: id,
      status: "PUBLISHED",
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    const authorData = {
      id: user.id,
      name: user.name ?? "Unknown",
      avatar: user.avatar ?? user.image ?? "",
      bio: user.bio ?? "",
      verified: user.role === "VERIFIED" || user.role === "AUTHOR",
      worksCount: works.total,
      totalHeat: "0",
      followers: user._count?.followers ?? 0,
      rating: 4.5,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const worksData = works.novels.map((n: any) => ({
      id: n.id,
      title: n.title,
      cover: n.cover ?? "",
      tags: n.novelTags?.map((nt: { tag: { name: string } }) => nt.tag.name) ?? [],
      rating: 4.5,
      heat: String(n.views ?? 0),
      chapterCount: n._count?.chapters ?? 0,
      wordCount: "0",
      status: (n.status === "ARCHIVED" ? "completed" : "ongoing") as "ongoing" | "completed",
    }));

    const ratingDistribution = [
      { star: 5, count: 0, percentage: 50 },
      { star: 4, count: 0, percentage: 30 },
      { star: 3, count: 0, percentage: 15 },
      { star: 2, count: 0, percentage: 3 },
      { star: 1, count: 0, percentage: 2 },
    ];

    const reviewsData: Array<{
      id: string;
      novelId: string;
      novelTitle: string;
      novelCover: string;
      userId: string;
      userName: string;
      userAvatar: string;
      rating: number;
      content: string;
      likes: number;
      createdAt: string;
    }> = [];

    return (
      <AppLayout>
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          <AuthorHeader data={authorData} />

          <AuthorTabContent
            works={worksData}
            feeds={[]}
            authorBio={authorData.bio}
            authorName={authorData.name}
            authorAvatar={authorData.avatar}
          />

          <Separator />

          <AuthorReviews
            reviews={reviewsData}
            ratingDistribution={ratingDistribution}
            averageRating={authorData.rating}
            totalReviews={0}
          />
        </div>
      </AppLayout>
    );
  } catch {
    notFound();
  }
}
