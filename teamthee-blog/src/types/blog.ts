export interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role?: string;
    avatar?: string;
  };
  featured?: boolean;
  published: boolean;
  readTimeMinutes?: number;
  createdAt: any; // Firestore Timestamp or ISO string / Date
  updatedAt?: any;
  views?: number;
}

export type PostCategory = 'ALL' | 'TECH' | 'DEV' | 'SECURITY' | 'AI' | 'UNDERGROUND' | 'SYSTEM';

export interface AdminUser {
  isAuthenticated: boolean;
  email?: string;
  identifier?: string;
  displayName?: string;
}

