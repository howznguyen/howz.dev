// Post Types for Blog
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  excerpt: string;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  category: string;
  author: string;
  featured: boolean;
  cover?: {
    url: string;
    alt?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    og_image?: string;
  };
  reading_time?: number;
  views?: number;
  likes?: number;
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  count: number;
  created_at: string;
  updated_at: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  count: number;
  created_at: string;
  updated_at: string;
}

// Author Types
export interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  created_at: string;
  updated_at: string;
}

// Comment Types
export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  author_website?: string;
  content: string;
  status: 'pending' | 'approved' | 'spam';
  parent_id?: string;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

// Search Types
export interface SearchResult {
  id: string;
  type: 'post' | 'tag' | 'category';
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  relevance: number;
  published_at?: string;
  tags?: string[];
  category?: string;
}

export interface SearchQuery {
  query: string;
  filters?: {
    type?: 'post' | 'tag' | 'category';
    tags?: string[];
    category?: string;
    published?: boolean;
    date_from?: string;
    date_to?: string;
  };
  sort?: {
    field: 'relevance' | 'published_at' | 'title' | 'views';
    order: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
}

// API Response Types
export interface PostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface TagsResponse {
  tags: Tag[];
  total: number;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  took: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// API Error Types
export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Pagination Types
export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  next_page?: number;
  prev_page?: number;
}

// Filter Types
export interface PostFilter {
  published?: boolean;
  featured?: boolean;
  tags?: string[];
  category?: string;
  author?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface PostSort {
  field: 'published_at' | 'created_at' | 'updated_at' | 'title' | 'views' | 'likes';
  order: 'asc' | 'desc';
}

// Table of Contents Types
export interface TOCItem {
  id: string;
  title: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  anchor: string;
  children?: TOCItem[];
}

// Reading Progress Types
export interface ReadingProgress {
  post_id: string;
  progress: number; // 0-100
  reading_time: number; // in seconds
  last_position: number; // scroll position
  completed: boolean;
  timestamp: string;
}

// Social Share Types
export interface SocialShare {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'reddit' | 'copy';
  url: string;
  text?: string;
  hashtags?: string[];
}

export default BlogPost;