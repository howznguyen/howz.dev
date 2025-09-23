// Base Notion Block Types
export interface NotionBlock {
  id: string;
  type: string;
  has_children: boolean;
  archived: boolean;
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: string;
    id: string;
  };
  last_edited_by: {
    object: string;
    id: string;
  };
  parent: {
    type: string;
    page_id?: string;
    database_id?: string;
  };
  object: string;
  children?: NotionBlock[];
}

// Text Content Types
export interface RichText {
  type: 'text' | 'mention' | 'equation';
  text?: {
    content: string;
    link?: {
      url: string;
    } | null;
  };
  mention?: any;
  equation?: {
    expression: string;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href?: string | null;
}

// Heading Blocks
export interface HeadingBlock extends NotionBlock {
  type: 'heading_1' | 'heading_2' | 'heading_3';
  heading_1?: {
    rich_text: RichText[];
    color: string;
    is_toggleable: boolean;
  };
  heading_2?: {
    rich_text: RichText[];
    color: string;
    is_toggleable: boolean;
  };
  heading_3?: {
    rich_text: RichText[];
    color: string;
    is_toggleable: boolean;
  };
}

// Paragraph Block
export interface ParagraphBlock extends NotionBlock {
  type: 'paragraph';
  paragraph: {
    rich_text: RichText[];
    color: string;
  };
}

// Code Block
export interface CodeBlock extends NotionBlock {
  type: 'code';
  code: {
    rich_text: RichText[];
    language: string;
    caption: RichText[];
  };
}

// Quote Block
export interface QuoteBlock extends NotionBlock {
  type: 'quote';
  quote: {
    rich_text: RichText[];
    color: string;
  };
}

// Callout Block
export interface CalloutBlock extends NotionBlock {
  type: 'callout';
  callout: {
    rich_text: RichText[];
    icon?: {
      type: 'emoji' | 'external' | 'file';
      emoji?: string;
      external?: {
        url: string;
      };
      file?: {
        url: string;
        expiry_time: string;
      };
    };
    color: string;
  };
}

// List Blocks
export interface BulletedListItemBlock extends NotionBlock {
  type: 'bulleted_list_item';
  bulleted_list_item: {
    rich_text: RichText[];
    color: string;
  };
}

export interface NumberedListItemBlock extends NotionBlock {
  type: 'numbered_list_item';
  numbered_list_item: {
    rich_text: RichText[];
    color: string;
  };
}

// Toggle Block
export interface ToggleBlock extends NotionBlock {
  type: 'toggle';
  toggle: {
    rich_text: RichText[];
    color: string;
  };
}

// Image Block
export interface ImageBlock extends NotionBlock {
  type: 'image';
  image: {
    type: 'external' | 'file';
    external?: {
      url: string;
    };
    file?: {
      url: string;
      expiry_time: string;
    };
    caption: RichText[];
  };
}

// Video Block
export interface VideoBlock extends NotionBlock {
  type: 'video';
  video: {
    type: 'external' | 'file';
    external?: {
      url: string;
    };
    file?: {
      url: string;
      expiry_time: string;
    };
    caption: RichText[];
  };
}

// Embed Block
export interface EmbedBlock extends NotionBlock {
  type: 'embed';
  embed: {
    url: string;
    caption: RichText[];
  };
}

// Bookmark Block
export interface BookmarkBlock extends NotionBlock {
  type: 'bookmark';
  bookmark: {
    url: string;
    caption: RichText[];
  };
}

// Table Block
export interface TableBlock extends NotionBlock {
  type: 'table';
  table: {
    table_width: number;
    has_column_header: boolean;
    has_row_header: boolean;
  };
}

export interface TableRowBlock extends NotionBlock {
  type: 'table_row';
  table_row: {
    cells: RichText[][];
  };
}

// Divider Block
export interface DividerBlock extends NotionBlock {
  type: 'divider';
  divider: Record<string, never>;
}

// File Block
export interface FileBlock extends NotionBlock {
  type: 'file';
  file: {
    type: 'external' | 'file';
    external?: {
      url: string;
    };
    file?: {
      url: string;
      expiry_time: string;
    };
    caption: RichText[];
    name: string;
  };
}

// Union type for all block types
export type AnyNotionBlock = 
  | HeadingBlock
  | ParagraphBlock
  | CodeBlock
  | QuoteBlock
  | CalloutBlock
  | BulletedListItemBlock
  | NumberedListItemBlock
  | ToggleBlock
  | ImageBlock
  | VideoBlock
  | EmbedBlock
  | BookmarkBlock
  | TableBlock
  | TableRowBlock
  | DividerBlock
  | FileBlock
  | NotionBlock;

// Helper types for content rendering
export interface HeadingContent {
  id: string;
  type: 'heading_1' | 'heading_2' | 'heading_3';
  content: string;
  level: 1 | 2 | 3;
}

export interface ProcessedBlock {
  id: string;
  type: string;
  content: any;
  children?: ProcessedBlock[];
}

export default AnyNotionBlock;