// Unified Notion Service - Single entry point
export { NotionService, notionService as default } from "./notion.service";

// Re-export essential utilities
export { NotionRenderService } from "./render.service";
export { getPage } from "./notion-x.service";

// Re-export types
export type { BlogPost, Tag, SearchResult } from "@/types/notion";
export type { Post } from "@/types";
export type { NotionHeading } from "./render.service";
