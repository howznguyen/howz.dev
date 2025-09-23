// Re-export all Notion types from a single entry point
export * from './blocks';
export * from './database';
export * from './blog';
export * from './api';

// Type Guards
import type { NotionBlock, AnyNotionBlock } from './blocks';
import type { NotionPage, AnyPageProperty } from './database';
import type { BlogPost, Tag, Category } from './blog';
import type { NotionAPIResponse, NotionError } from './api';

// Block Type Guards
export function isHeadingBlock(block: AnyNotionBlock): block is NotionBlock & { type: 'heading_1' | 'heading_2' | 'heading_3' } {
  return ['heading_1', 'heading_2', 'heading_3'].includes(block.type);
}

export function isParagraphBlock(block: AnyNotionBlock): block is NotionBlock & { type: 'paragraph' } {
  return block.type === 'paragraph';
}

export function isCodeBlock(block: AnyNotionBlock): block is NotionBlock & { type: 'code' } {
  return block.type === 'code';
}

export function isImageBlock(block: AnyNotionBlock): block is NotionBlock & { type: 'image' } {
  return block.type === 'image';
}

export function isVideoBlock(block: AnyNotionBlock): block is NotionBlock & { type: 'video' } {
  return block.type === 'video';
}

export function isCalloutBlock(block: AnyNotionBlock): block is NotionBlock & { type: 'callout' } {
  return block.type === 'callout';
}

export function isQuoteBlock(block: AnyNotionBlock): block is NotionBlock & { type: 'quote' } {
  return block.type === 'quote';
}

export function isListBlock(block: AnyNotionBlock): block is NotionBlock & { type: 'bulleted_list_item' | 'numbered_list_item' } {
  return ['bulleted_list_item', 'numbered_list_item'].includes(block.type);
}

export function isTableBlock(block: AnyNotionBlock): block is NotionBlock & { type: 'table' } {
  return block.type === 'table';
}

export function isEmbedBlock(block: AnyNotionBlock): block is NotionBlock & { type: 'embed' } {
  return block.type === 'embed';
}

export function isBookmarkBlock(block: AnyNotionBlock): block is NotionBlock & { type: 'bookmark' } {
  return block.type === 'bookmark';
}

export function isDividerBlock(block: AnyNotionBlock): block is NotionBlock & { type: 'divider' } {
  return block.type === 'divider';
}

// Property Type Guards
export function isTitleProperty(property: AnyPageProperty): property is AnyPageProperty & { type: 'title' } {
  return property.type === 'title';
}

export function isRichTextProperty(property: AnyPageProperty): property is AnyPageProperty & { type: 'rich_text' } {
  return property.type === 'rich_text';
}

export function isSelectProperty(property: AnyPageProperty): property is AnyPageProperty & { type: 'select' } {
  return property.type === 'select';
}

export function isMultiSelectProperty(property: AnyPageProperty): property is AnyPageProperty & { type: 'multi_select' } {
  return property.type === 'multi_select';
}

export function isDateProperty(property: AnyPageProperty): property is AnyPageProperty & { type: 'date' } {
  return property.type === 'date';
}

export function isNumberProperty(property: AnyPageProperty): property is AnyPageProperty & { type: 'number' } {
  return property.type === 'number';
}

export function isCheckboxProperty(property: AnyPageProperty): property is AnyPageProperty & { type: 'checkbox' } {
  return property.type === 'checkbox';
}

export function isURLProperty(property: AnyPageProperty): property is AnyPageProperty & { type: 'url' } {
  return property.type === 'url';
}

// API Type Guards
export function isNotionError(response: any): response is NotionError {
  return response && response.object === 'error';
}

export function isNotionAPIResponse<T>(response: any): response is NotionAPIResponse<T> {
  return response && typeof response.object === 'string' && Array.isArray(response.results);
}

// Blog Type Guards
export function isBlogPost(item: any): item is BlogPost {
  return item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.slug === 'string';
}

export function isTag(item: any): item is Tag {
  return item && typeof item.id === 'string' && typeof item.name === 'string' && typeof item.slug === 'string';
}

export function isCategory(item: any): item is Category {
  return item && typeof item.id === 'string' && typeof item.name === 'string' && typeof item.slug === 'string';
}

// Utility Types
export type ExtractBlockType<T extends AnyNotionBlock['type']> = Extract<AnyNotionBlock, { type: T }>;
export type ExtractPropertyType<T extends AnyPageProperty['type']> = Extract<AnyPageProperty, { type: T }>;

// Helper Functions
export function getPlainTextFromRichText(richText: any[]): string {
  if (!Array.isArray(richText)) return '';
  return richText.map(text => text.plain_text || '').join('');
}

export function extractHeadingFromBlock(block: AnyNotionBlock): { id: string; content: string; level: 1 | 2 | 3 } | null {
  if (!isHeadingBlock(block)) return null;
  
  const level = block.type === 'heading_1' ? 1 : block.type === 'heading_2' ? 2 : 3;
  const richText = (block as any)[block.type]?.rich_text || [];
  const content = getPlainTextFromRichText(richText);
  
  return {
    id: block.id,
    content,
    level
  };
}

export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Constants
export const NOTION_BLOCK_TYPES = [
  'paragraph',
  'heading_1',
  'heading_2', 
  'heading_3',
  'code',
  'quote',
  'callout',
  'bulleted_list_item',
  'numbered_list_item',
  'toggle',
  'image',
  'video',
  'embed',
  'bookmark',
  'table',
  'table_row',
  'divider',
  'file'
] as const;

export const NOTION_PROPERTY_TYPES = [
  'title',
  'rich_text',
  'number',
  'select',
  'multi_select',
  'date',
  'checkbox',
  'url',
  'email',
  'phone_number',
  'formula',
  'relation',
  'rollup',
  'people',
  'files',
  'created_time',
  'created_by',
  'last_edited_time',
  'last_edited_by'
] as const;

export type NotionBlockType = typeof NOTION_BLOCK_TYPES[number];
export type NotionPropertyType = typeof NOTION_PROPERTY_TYPES[number];