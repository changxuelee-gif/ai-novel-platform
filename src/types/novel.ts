export interface NovelCard {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  popularity: number;
  tags: string[];
  status: "ongoing" | "completed";
  genre: string;
  language: string;
  description?: string;
}

export interface ActivityCardData {
  id: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  themeColor: string;
  cover?: string;
}

export interface RankingItem {
  id: string;
  title: string;
  popularity: number;
}

export interface RecentRead {
  id: string;
  title: string;
  cover: string;
}

export interface CheckinDay {
  day: number;
  checked: boolean;
  isToday: boolean;
}

// ===== Activity Page Types =====

export interface ActivityBannerData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  participants: number;
  submissions: number;
  remainingTime: string;
  themeColor: string;
  icon?: string;
}

export interface ActivityCardDataExtended extends ActivityCardData {
  status: "ongoing" | "upcoming" | "ended";
  participants: number;
  reward: string;
  progress: number;
  category: string;
}

export interface ActivityWorkItem {
  id: string;
  rank: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  views: number;
  trend?: number;
}

export interface ActivityDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  rules: string[];
  rewards: { rank: string; reward: string }[];
  submissions: ActivityWorkItem[];
  status: "ongoing" | "upcoming" | "ended";
  startDate: string;
  endDate: string;
  participants: number;
  category: string;
  themeColor: string;
}

// ===== Ranking Page Types =====

export type RankingType = "popularity" | "newbook" | "rating" | "rising" | "completed" | "signed";
export type RankingTimeRange = "all" | "week" | "month";

export interface RankingListItem {
  id: string;
  rank: number;
  title: string;
  author: string;
  authorId: string;
  cover: string;
  category: string;
  rating: number;
  views: number;
  wordCount: number;
  chapterCount: number;
  status: "ongoing" | "completed";
  trend: "up" | "down" | "flat";
  trendValue?: number;
}

// ===== Author Page Types =====

export interface AuthorProfile {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  bio: string;
  worksCount: number;
  totalHeat: string;
  followers: number;
  rating: number;
  banner?: string;
}

export interface AuthorWork {
  id: string;
  title: string;
  cover: string;
  tags: string[];
  rating: number;
  heat: string;
  chapterCount: number;
  wordCount: string;
  status: "ongoing" | "completed" | "draft";
  activityTag?: string;
  description?: string;
}

export interface AuthorFeedItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  relatedWork?: {
    title: string;
    cover: string;
    chapterTitle: string;
    wordCount: string;
    updatedAt: string;
  };
  likes: number;
  comments: number;
}

export interface AuthorReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  likes: number;
  createdAt: string;
}

export interface RatingDistribution {
  star: number;
  percentage: number;
  count: number;
}
