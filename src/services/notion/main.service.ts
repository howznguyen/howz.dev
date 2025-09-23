// Main entry point for Notion services
export { default as Notion } from "./index";
export {
  UnofficialNotionService,
  notionService,
} from "./unofficial-api.service";

export {
  EnhancedNotionService,
  enhancedNotionService,
} from "./enhanced.service";

export {
  NotionRenderService,
  notionRenderService,
  type NotionRenderBlock,
  type NotionHeading,
  type NotionRichTextData,
} from "./render.service";

// API services
export {
  getUnofficialDatabase,
  queryDatabase,
  retrieveDatabase,
  retrievePage,
  retrieveBlockChildren,
  getCustomEmojiBlock,
  getBlocks,
  searchNotion,
  searchNotionPersonal,
} from "./api.service";

// NotionX services
export { notionX, getPage } from "./notion-x.service";

// Utility functions
export {
  convertNotionResponseToPosts,
  filterPublishedPosts,
  sortPostsByDate,
  filterPostsByTags,
  searchPosts,
  getAllTags,
  getPostsByTag,
  getPostBySlug,
  getRelatedPosts,
  getFeaturedPosts,
  convertRecordMapToApiBlocks,
  defaultMapImageUrl,
  type ConvertedPost,
  type NotionApiBlock,
} from "./utils.service";

// Main service - enhanced for better performance
export { enhancedNotionService as default } from "./enhanced.service";

// Re-export types for convenience
export type { BlogPost, Tag, SearchResult } from "@/types/notion";
