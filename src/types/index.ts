// Common types used across the application

export interface Post {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  status: "Published" | "Draft" | "In progress";
  tags: string[];
  featured: boolean;
  cover?: string;
  author?: string;
  readingTime?: number;
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  name: string;
  count: number;
  color?: string;
}

export interface Navigation {
  id: string;
  title: string;
  index: number;
  url: string;
  parent: string | null;
  children: Navigation[];
}

export interface Category {
  name: string;
  description: string;
  value: string | string[];
}

export interface NotionBlock {
  id: string;
  type: string;
  properties?: any;
  format?: any;
  content?: string[];
  children?: NotionBlock[];
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  score: number;
}

export interface PageMeta {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LinkProps extends BaseComponentProps {
  href: string;
  title?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

export interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export interface IconProps {
  icon: string;
  className?: string;
  size?: number;
}

// Theme types
export type Theme = "light" | "dark" | "system";

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Notion specific types
export interface NotionPage {
  id: string;
  properties: any;
  children?: NotionBlock[];
  recordMap?: any;
}

export interface NotionDatabase {
  id: string;
  title: string;
  description?: string;
  properties: any;
  pages: NotionPage[];
}

// Translation types
export interface TranslationKeys {
  common: {
    loading: string;
    error: string;
    retry: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    no_results: string;
    is_loading: string;
    process_take_few_second: string;
  };
  home: {
    intro: {
      header: string;
      description: string;
    };
  };
  blog: {
    title: string;
    latest_posts: string;
    read_more: string;
    reading_time: string;
  };
  post: {
    back_to_blog: string;
    share: string;
    table_of_contents: string;
    related_posts: string;
  };
  navigation: {
    home: string;
    blog: string;
    about: string;
    contact: string;
  };
}
