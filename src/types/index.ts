export interface User {
  id: string;
  name: string;
  email: string;
  role: "MEMBER" | "ADMIN";
  avatar?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  _count?: { ideas: number; votes: number; comments: number };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  _count?: { ideas: number };
}

export type IdeaStatus = "DRAFT" | "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export interface Idea {
  id: string;
  title: string;
  slug: string;
  problemStatement: string;
  proposedSolution: string;
  description: string;
  images: string[];
  isPaid: boolean;
  price?: number | null;
  status: IdeaStatus;
  rejectionFeedback?: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string; avatar?: string; bio?: string };
  category: Category;
  _count: { votes: number; comments: number };
  upvotes?: number;
  downvotes?: number;
  userVote?: "UPVOTE" | "DOWNVOTE" | null;
  isPaidAndLocked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentId?: string | null;
  user: { id: string; name: string; avatar?: string };
  replies?: Comment[];
}

export interface Purchase {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  idea: Idea;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
}
