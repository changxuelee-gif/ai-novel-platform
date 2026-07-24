export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "reader" | "author" | "admin";
  createdAt: string;
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  authorId: string;
  cover: string | null;
  description: string;
  genre: string;
  status: "ongoing" | "completed" | "hiatus";
  chapterCount: number;
  wordCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  novelId: string;
  title: string;
  content: string;
  order: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
  novelId: string | null;
  traits: string[];
}

export interface WritingStyle {
  id: string;
  name: string;
  description: string;
  example: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  novelId: string;
  chapterId?: string;
  content: string;
  parentId?: string;
  likes: number;
  replies: Comment[];
  createdAt: string;
}

export interface ReadingHistory {
  id: string;
  novelId: string;
  novelTitle: string;
  novelCover: string;
  chapterTitle: string;
  chapterOrder: number;
  readAt: string;
}

export interface BookshelfItem {
  novelId: string;
  title: string;
  author: string;
  cover: string;
  progress: number;
  lastReadChapter: string;
  category: "all" | "following" | "completed" | "pending";
  addedAt: string;
  updatedAt: string;
}

export interface VoteOption {
  id: string;
  label: string;
  votes: number;
  percentage: number;
}

export interface ReaderSettings {
  fontSize: number;
  lineHeight: number;
  bgColor: "day" | "night" | "eye" | "parchment";
  pageMode: "scroll" | "click" | "none";
}

export interface InteractiveChoice {
  id: string;
  chapterId: string;
  options: { id: string; text: string; targetChapterId: string }[];
}
