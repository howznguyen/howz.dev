import { } from '@/types';

// Site configuration
export const SITE_CONFIG = {
  name: "Howz",
  description: "Howz is a blog about web development, programming and technology.",
  author: "Howz Nguyen",
  url: "https://howz.dev",
  locale: "en",
  defaultTheme: "light" as const,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  POSTS: "posts",
  THEME: "theme",
  LANGUAGE: "language",
  VIEWED_POSTS: "viewed_posts",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  POSTS: "/api/posts",
  POST: (slug: string) => `/api/post/${slug}`,
  SEARCH: "/api/search",
  TAGS: "/api/tags",
  VIEWS: "/api/post/views",
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
} as const;

// SEO defaults
export const SEO_DEFAULTS = {
  TITLE_TEMPLATE: "%s | Howz.dev",
  DESCRIPTION: SITE_CONFIG.description,
  TWITTER_HANDLE: "@howznguyen",
  OG_TYPE: "website",
} as const;

// Reading time estimates
export const READING_TIME = {
  WORDS_PER_MINUTE: 200,
  WORDS_PER_SECOND: 200 / 60, // 3.33
} as const;

// Animation and UI constants
export const UI_CONFIG = {
  HEADER_HEIGHT: 70,
  SCROLL_OFFSET: 100,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
} as const;

// Image and media constants
export const MEDIA_CONFIG = {
  DEFAULT_BLUR_DATA_URL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyiwjTsEaOF0sL+1X0F4Q7fLV3GlfIp6RKCJoQ4kSO3WkrXnTaKjk/rMd9h1FDu5ZLdLv3dWr4iq89xKMvzPc=",
  MAX_IMAGE_WIDTH: 1200,
  THUMBNAIL_WIDTH: 400,
} as const;
