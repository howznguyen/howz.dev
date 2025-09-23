// Environment configuration with validation
interface EnvironmentConfig {
  BASE_URL: string;
  NOTION_API_KEY: string;
  NOTION_TOKEN_V2?: string;
  NOTION_ACTIVE_USER?: string;
  NOTION_API_WEB?: string;
  NOTION_SPACE_ID?: string;
  NOTION_POST_DATABASE_VIEW?: string;
  NOTION_POST_DATABASE_ID?: string;
  SEARCH_BOLD_KEY: string;
  NEXT_PUBLIC_ID_SLUG?: string;
  NEXT_PUBLIC_ID_PUBLISHED?: string;
  NEXT_PUBLIC_ID_HIDE?: string;
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
  GISCUS_REPO?: string;
  GISCUS_REPO_ID?: string;
  GISCUS_CATEGORY?: string;
  GISCUS_CATEGORY_ID?: string;
}

// Validate required environment variables
function validateEnv(): EnvironmentConfig {
  return {
    BASE_URL: process.env.BASE_URL || 'https://howz.dev',
    NOTION_API_KEY: process.env.NOTION_API_KEY!,
    NOTION_TOKEN_V2: process.env.NOTION_TOKEN_V2,
    NOTION_ACTIVE_USER: process.env.NOTION_ACTIVE_USER,
    NOTION_API_WEB: process.env.NOTION_API_WEB,
    NOTION_SPACE_ID: process.env.NOTION_SPACE_ID,
    NOTION_POST_DATABASE_VIEW: process.env.NOTION_POST_DATABASE_VIEW,
    NOTION_POST_DATABASE_ID: process.env.NOTION_POST_DATABASE_ID,
    SEARCH_BOLD_KEY: process.env.SEARCH_BOLD_KEY || 'mark',
    NEXT_PUBLIC_ID_SLUG: process.env.NEXT_PUBLIC_ID_SLUG,
    NEXT_PUBLIC_ID_PUBLISHED: process.env.NEXT_PUBLIC_ID_PUBLISHED,
    NEXT_PUBLIC_ID_HIDE: process.env.NEXT_PUBLIC_ID_HIDE,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    GISCUS_REPO: process.env.GISCUS_REPO,
    GISCUS_REPO_ID: process.env.GISCUS_REPO_ID,
    GISCUS_CATEGORY: process.env.GISCUS_CATEGORY,
    GISCUS_CATEGORY_ID: process.env.GISCUS_CATEGORY_ID,
  };
}

// Export validated environment variables
export const env = validateEnv();

// Legacy exports for backward compatibility
export const BASE_URL = env.BASE_URL;
export const NOTION_API_KEY = env.NOTION_API_KEY;
export const NOTION_ACTIVE_USER = env.NOTION_ACTIVE_USER;
export const NOTION_TOKEN_V2 = env.NOTION_TOKEN_V2;
export const NOTION_POST_DATABASE_VIEW = env.NOTION_POST_DATABASE_VIEW;
export const NOTION_POST_DATABASE_ID = env.NOTION_POST_DATABASE_ID;
export const POST_DATABASE_ID = env.NOTION_POST_DATABASE_ID || '';

export const GISCUS_REPO = env.GISCUS_REPO;
export const GISCUS_REPO_ID = env.GISCUS_REPO_ID;
export const GISCUS_CATEGORY = env.GISCUS_CATEGORY;
export const GISCUS_CATEGORY_ID = env.GISCUS_CATEGORY_ID;
