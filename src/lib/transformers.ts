import type { NovelCard, ActivityCardData, RankingListItem } from "@/types/novel";
import type { MockNovel, MockChapter } from "@/lib/mock-data";
import type { NovelStatus as PrismaNovelStatus } from "@/generated/prisma/client";

/** Extract tag names from Prisma novelTags relation */
export function getTagNames(novel: { novelTags?: Array<{ tag: { name: string } }> }): string[] {
  return novel.novelTags?.map((nt) => nt.tag.name) ?? [];
}

/** Map Prisma NovelStatus to frontend status string */
function mapStatus(status?: PrismaNovelStatus): "ongoing" | "completed" {
  if (status === "ARCHIVED" || status === "DRAFT") return "ongoing";
  return status === "PUBLISHED" ? "ongoing" : "ongoing";
}

/** Transform a Prisma novel (with relations) to NovelCard */
export function toNovelCard(novel: {
  id: string;
  title: string;
  cover?: string | null;
  summary?: string | null;
  views: number;
  status?: PrismaNovelStatus;
  author?: { name?: string | null } | null;
  category?: { slug?: string | null } | null;
  novelTags?: Array<{ tag: { name: string } }>;
  _count?: { favorites?: number; ratings?: number };
  ratings?: Array<{ score: number }>;
}): NovelCard {
  const avgRating =
    novel.ratings && novel.ratings.length > 0
      ? novel.ratings.reduce((sum, r) => sum + r.score, 0) / novel.ratings.length
      : 4.0;

  return {
    id: novel.id,
    title: novel.title,
    author: novel.author?.name ?? "Unknown",
    cover: novel.cover ?? "",
    rating: Math.round(avgRating * 10) / 10,
    popularity: novel.views,
    tags: getTagNames(novel),
    status: mapStatus(novel.status),
    genre: novel.category?.slug ?? "all",
    language: "zh",
    description: novel.summary ?? undefined,
  };
}

/** Transform Prisma activity to ActivityCardData */
export function toActivityCard(activity: {
  id: string;
  title: string;
  description?: string | null;
  cover?: string | null;
  startDate: Date;
  endDate: Date;
}): ActivityCardData {
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  const colors = ["bg-gray-800", "bg-orange-500", "bg-slate-700", "bg-blue-600", "bg-emerald-600"];
  const colorIndex = activity.id.charCodeAt(activity.id.length - 1) % colors.length;

  return {
    id: activity.id,
    title: activity.title,
    subtitle: activity.description ?? "",
    startDate: fmt(activity.startDate),
    endDate: fmt(activity.endDate),
    themeColor: colors[colorIndex],
    cover: activity.cover ?? undefined,
  };
}

/** Transform Prisma novel to RankingItem */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toRankingItem(novel: any, index: number = 0): RankingListItem {
  return {
    id: novel.id,
    rank: index + 1,
    title: novel.title,
    author: novel.author?.name ?? "Unknown",
    authorId: novel.author?.id ?? "",
    cover: novel.cover ?? "",
    category: novel.category?.name ?? "All",
    rating: 0,
    views: novel.views ?? 0,
    wordCount: 0,
    chapterCount: novel._count?.chapters ?? 0,
    status: novel.status === "ARCHIVED" ? "completed" : "ongoing",
    trend: "flat",
  };
}

/** Transform Prisma novel (with full relations) to MockNovel */
export function toMockNovel(novel: {
  id: string;
  title: string;
  cover?: string | null;
  summary?: string | null;
  views: number;
  status?: PrismaNovelStatus;
  aiAssisted?: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: { id: string; name?: string | null; avatar?: string | null; image?: string | null; role?: string };
  category?: { name?: string | null } | null;
  novelTags?: Array<{ tag: { name: string } }>;
  chapters?: Array<{ id: string; content?: string }>;
  ratings?: Array<{ score: number }>;
  _count?: { favorites?: number; ratings?: number; chapters?: number };
}): MockNovel {
  const avgRating =
    novel.ratings && novel.ratings.length > 0
      ? novel.ratings.reduce((sum, r) => sum + r.score, 0) / novel.ratings.length
      : 4.5;
  const ratingRounded = Math.round(avgRating * 10) / 10;
  const chapterCount = novel._count?.chapters ?? novel.chapters?.length ?? 0;
  const totalWords = novel.chapters?.reduce((sum, ch) => sum + (ch.content?.length ?? 0), 0) ?? 0;

  const statusMap: Record<string, "ongoing" | "completed" | "hiatus"> = {
    PUBLISHED: "ongoing",
    DRAFT: "ongoing",
    ARCHIVED: "completed",
  };

  return {
    id: novel.id,
    title: novel.title,
    cover: novel.cover ?? "",
    author: {
      id: novel.author.id,
      name: novel.author.name ?? "Unknown",
      avatar: novel.author.avatar ?? novel.author.image ?? "",
      verified: novel.author.role === "VERIFIED" || novel.author.role === "AUTHOR",
    },
    category: novel.category?.name ?? "未分类",
    tags: getTagNames(novel),
    status: statusMap[novel.status ?? "PUBLISHED"] ?? "ongoing",
    description: novel.summary ?? "",
    views: novel.views,
    favorites: novel._count?.favorites ?? 0,
    chapterCount,
    wordCount: totalWords,
    rating: ratingRounded,
    ratingCount: novel._count?.ratings ?? novel.ratings?.length ?? 0,
    createdAt: novel.createdAt.toISOString().split("T")[0],
    updatedAt: novel.updatedAt.toISOString().split("T")[0],
  };
}

/** Transform Prisma chapter to MockChapter */
export function toMockChapter(chapter: {
  id: string;
  title: string;
  content?: string;
  order: number;
  isPremium: boolean;
  novelId?: string;
  createdAt: Date;
}): MockChapter {
  return {
    id: chapter.id,
    novelId: chapter.novelId ?? "",
    title: chapter.title,
    content: chapter.content ?? "",
    order: chapter.order,
    wordCount: chapter.content?.length ?? 0,
    isPremium: chapter.isPremium,
    createdAt: chapter.createdAt.toISOString().split("T")[0],
  };
}

/** Transform Prisma comment to frontend Comment type */
export function toComment(comment: {
  id: string;
  content: string;
  createdAt: Date;
  user: { id: string; name?: string | null; avatar?: string | null; image?: string | null };
  replies?: Array<{
    id: string;
    content: string;
    createdAt: Date;
    user: { id: string; name?: string | null; avatar?: string | null; image?: string | null };
  }>;
}): import("@/types").Comment {
  return {
    id: comment.id,
    userId: comment.user.id,
    userName: comment.user.name ?? "Anonymous",
    userAvatar: comment.user.avatar ?? comment.user.image ?? "",
    novelId: "",
    content: comment.content,
    likes: 0,
    replies: (comment.replies ?? []).map((r) => ({
      id: r.id,
      userId: r.user.id,
      userName: r.user.name ?? "Anonymous",
      userAvatar: r.user.avatar ?? r.user.image ?? "",
      novelId: "",
      content: r.content,
      likes: 0,
      replies: [],
      createdAt: r.createdAt.toISOString().split("T")[0],
    })),
    createdAt: comment.createdAt.toISOString().split("T")[0],
  };
}
