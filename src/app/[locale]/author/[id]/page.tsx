import { AppLayout } from "@/components/layout/AppLayout";
import { AuthorHeader } from "@/components/author/AuthorHeader";

import { AuthorReviews } from "@/components/author/AuthorReviews";
import { AuthorTabContent } from "./AuthorTabContent";
import { Separator } from "@/components/ui/separator";
import {
  getAuthorById,
  getAuthorWorksByAuthorId,
  getAuthorFeedsByAuthorId,
  getAuthorReviewsByAuthorId,
  mockRatingDistribution,
} from "@/lib/mock-data";
import { notFound } from "next/navigation";

interface AuthorPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params;
  const author = getAuthorById(id);

  if (!author) {
    notFound();
  }

  const works = getAuthorWorksByAuthorId(id);
  const feeds = getAuthorFeedsByAuthorId(id);
  const reviews = getAuthorReviewsByAuthorId(id);

  const totalReviews = mockRatingDistribution.reduce(
    (sum, d) => sum + d.count,
    0
  );

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Author Header */}
        <AuthorHeader data={author} />

        {/* Tab Content */}
        <AuthorTabContent
          works={works}
          feeds={feeds}
          authorBio={author.bio}
          authorName={author.name}
          authorAvatar={author.avatar}
        />

        <Separator />

        {/* Reviews - always visible */}
        <AuthorReviews
          reviews={reviews}
          ratingDistribution={mockRatingDistribution}
          averageRating={author.rating}
          totalReviews={totalReviews}
        />
      </div>
    </AppLayout>
  );
}
