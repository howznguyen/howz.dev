import type { ExtendedRecordMap } from "notion-types";

// Types for rendered content
export interface NotionRenderBlock {
  type: string;
  key: number;
  content?: string;
  richText?: any[];
  id?: string;
  level?: number;
  emoji?: string;
  language?: string;
  url?: string;
  caption?: string;
  hasChildren?: boolean;
  children?: NotionRenderBlock[];
  number?: number;
  title?: string;
  description?: string;
  cover?: string;
  icon?: string;
  data?: any[][];
  options?: any;
  annotations?: any;
  link?: string | null;
}

export interface NotionHeading {
  type: string;
  id: string;
  text: string;
  level: number;
}

export interface NotionRichTextData {
  index: number;
  content: string;
  annotations: any;
  link: string | null;
  type: "text" | "link";
}

/**
 * Notion Render Service
 * Handles rendering Notion blocks to structured data for React components
 */
export class NotionRenderService {
  /**
   * Convert Notion blocks to structured render data
   */
  static blocksToRenderData(contents: Array<any>): NotionRenderBlock[] {
    return contents
      .map((content, i) => this.blockToRenderData(content, i, contents))
      .filter(Boolean) as NotionRenderBlock[];
  }

  /**
   * Extract headings from Notion blocks for TOC
   */
  static extractHeadings(contents: Array<any>): NotionHeading[] {
    const headingTypes = ["heading_1", "heading_2", "heading_3"];

    const headings = contents.filter((content) =>
      headingTypes.includes(content.type)
    );

    if (headings.length > 0) {
      return headings.map((content) => {
        const type = content.type;
        let richText;

        // Handle both old and new format
        if (content[type] && content[type].rich_text) {
          richText = content[type].rich_text;
        } else if (content[type] && Array.isArray(content[type])) {
          richText = content[type];
        } else {
          richText = [];
        }

        const text = this.richTextToString(richText);
        const id = content.id.replace(/-/g, "");

        return {
          type: type,
          id: id,
          text: text,
          level: parseInt(type.split("_")[1]), // Extract level from heading_1, heading_2, etc.
        };
      });
    }
    return [];
  }

  /**
   * Convert single Notion block to structured render data
   */
  private static blockToRenderData(
    content: any,
    index: number,
    contents: Array<any>
  ): NotionRenderBlock | null {
    if (!content || !content.type) {
      return null;
    }

    const type = content.type;

    // Get rich text content
    let richText;
    if (content[type] && content[type].rich_text) {
      richText = content[type].rich_text ?? [];
    } else if (content[type] && Array.isArray(content[type])) {
      richText = content[type] ?? [];
    } else {
      richText = [];
    }

    // Convert to proper format for RichText component
    const convertedRichText = this.richTextToReactData(richText);
    const textContent = this.richTextToString(richText);

    switch (type) {
      case "paragraph":
        return {
          type: "paragraph",
          content: textContent,
          richText: convertedRichText,
          key: index,
        };

      case "heading_1":
      case "heading_2":
      case "heading_3":
        const id = content.id.replace(/-/g, "");
        return {
          type: type,
          content: textContent,
          richText: convertedRichText,
          id: id,
          key: index,
        };

      case "quote":
        return {
          type: "blockquote",
          content: textContent,
          richText: convertedRichText,
          key: index,
        };

      case "callout":
        const emoji = content[type]?.icon?.emoji || "💡";
        return {
          type: "callout",
          emoji: emoji,
          content: textContent,
          richText: convertedRichText,
          hasChildren: content.has_children,
          children: content.has_children
            ? this.blocksToRenderData(content.children)
            : [],
          key: index,
        };

      case "code":
        const language = content[type]?.language || "text";
        const codeText = this.richTextToString(content[type]?.rich_text || []);
        return {
          type: "code",
          language: language,
          content: codeText,
          key: index,
        };

      case "image":
        const imageUrl = content[type]?.[content[type]?.type]?.url;
        const caption = this.richTextToString(content[type]?.caption || []);

        if (!imageUrl || imageUrl.trim() === "") {
          return null;
        }

        return {
          type: "image",
          url: imageUrl,
          caption: caption,
          key: index,
        };

      case "bulleted_list_item":
        return {
          type: "bulleted_list_item",
          content: textContent,
          richText: convertedRichText,
          hasChildren: content.has_children,
          children: content.has_children
            ? this.blocksToRenderData(content.children)
            : [],
          key: index,
        };

      case "numbered_list_item":
        // Calculate list number
        let listNumber = 1;
        for (let i = 0; i < contents.length; i++) {
          if (contents[i].type === "numbered_list_item") {
            if (i > 0 && contents[i - 1].type === "numbered_list_item") {
              listNumber++;
            } else {
              listNumber = 1;
            }
          }
          if (contents[i].id === content.id) break;
        }

        return {
          type: "numbered_list_item",
          content: textContent,
          richText: convertedRichText,
          number: listNumber,
          hasChildren: content.has_children,
          children: content.has_children
            ? this.blocksToRenderData(content.children)
            : [],
          key: index,
        };

      case "toggle":
        return {
          type: "toggle",
          title: textContent,
          richText: convertedRichText,
          hasChildren: content.has_children,
          children: content.has_children
            ? this.blocksToRenderData(content.children)
            : [],
          key: index,
        };

      case "bookmark":
        let bookmarkUrl = "";
        let bookmarkTitle = "";
        let bookmarkDescription = "";
        let bookmarkCover = "";
        let bookmarkIcon = "";

        if (content.bookmark && typeof content.bookmark === "object") {
          bookmarkUrl = content.bookmark.url;
          bookmarkTitle = content.bookmark.title || "";
          bookmarkDescription = content.bookmark.description || "";
          bookmarkCover = content.bookmark.cover || "";
          bookmarkIcon = content.bookmark.icon || "";
        } else if (content[type]) {
          bookmarkUrl = content[type]?.url || "";
          bookmarkTitle = content[type]?.title || "";
          bookmarkDescription = content[type]?.description || "";
          bookmarkCover = content[type]?.cover || "";
          bookmarkIcon = content[type]?.icon || "";
        }

        if (!bookmarkUrl || bookmarkUrl.trim() === "") {
          return null;
        }

        return {
          type: "bookmark",
          url: bookmarkUrl,
          title: bookmarkTitle,
          description: bookmarkDescription,
          cover: bookmarkCover,
          icon: bookmarkIcon,
          key: index,
        };

      case "embed":
        const embedUrl = content[type]?.url;
        if (!embedUrl || embedUrl.trim() === "") {
          return null;
        }

        return {
          type: "embed",
          url: embedUrl,
          key: index,
        };

      case "video":
        let videoUrl = "";
        if (content[type] && content[type].type === "external") {
          videoUrl = content[type].external.url;
        } else if (content.video && content.video.external) {
          videoUrl = content.video.external.url;
        }

        if (!videoUrl || videoUrl.trim() === "") {
          return null;
        }

        return {
          type: "video",
          url: videoUrl,
          key: index,
        };

      case "table":
        const options = content[type];
        const data =
          content.children?.map((row: any) => {
            const rowType = row.type;
            const cells = row[rowType]?.cells || [];
            return cells;
          }) || [];

        return {
          type: "table",
          data: data,
          options: options,
          key: index,
        };

      case "divider":
        return {
          type: "divider",
          key: index,
        };

      default:
        // Unknown block type, render as paragraph
        return {
          type: "paragraph",
          content: textContent,
          richText: convertedRichText,
          key: index,
        };
    }
  }

  /**
   * Convert rich text to plain string
   */
  private static richTextToString(richText: Array<any>): string {
    if (!richText || !Array.isArray(richText)) {
      return "";
    }

    return richText
      .map((content: any) => {
        if (content.text && content.text.content) {
          return content.text.content;
        } else if (content.plain_text) {
          return content.plain_text;
        } else if (content.content) {
          return content.content;
        }
        return "";
      })
      .join("");
  }

  /**
   * Convert rich text to structured format for React rendering
   */
  static richTextToReactData(richText: Array<any>): NotionRichTextData[] {
    if (!richText || !Array.isArray(richText)) {
      return [];
    }

    return richText.map((content: any, index: number) => {
      const annotations = content.annotations || {};
      let textContent = "";
      let linkUrl = null;

      if (content.text) {
        textContent = content.text.content;
        linkUrl = content.text.link?.url;
      } else if (content.plain_text) {
        textContent = content.plain_text;
      } else if (content.content) {
        textContent = content.content;
      }

      return {
        index,
        content: textContent,
        annotations,
        link: linkUrl,
        type: linkUrl ? "link" : "text",
      };
    });
  }

  /**
   * Extract all text content from blocks
   */
  static extractTextContent(contents: Array<any>): string {
    return contents
      .map((content) => {
        if (!content || !content.type) return "";

        const type = content.type;
        let richText;

        if (content[type] && content[type].rich_text) {
          richText = content[type].rich_text;
        } else if (content[type] && Array.isArray(content[type])) {
          richText = content[type];
        } else {
          richText = [];
        }

        return this.richTextToString(richText);
      })
      .join(" ")
      .trim();
  }

  /**
   * Calculate reading time from content
   */
  static calculateReadingTime(
    contents: Array<any>,
    wordsPerMinute: number = 200
  ): number {
    const textContent = this.extractTextContent(contents);
    const words = textContent.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  }

  /**
   * Search within content blocks
   */
  static searchInContent(contents: Array<any>, query: string): boolean {
    const textContent = this.extractTextContent(contents).toLowerCase();
    return textContent.includes(query.toLowerCase());
  }

  /**
   * Get content summary/excerpt
   */
  static getContentSummary(
    contents: Array<any>,
    maxLength: number = 160
  ): string {
    const textContent = this.extractTextContent(contents);

    if (textContent.length <= maxLength) {
      return textContent;
    }

    // Find the last complete sentence within the limit
    const truncated = textContent.substring(0, maxLength);
    const lastSentence = truncated.lastIndexOf(".");
    const lastSpace = truncated.lastIndexOf(" ");

    const cutPoint = lastSentence > 0 ? lastSentence + 1 : lastSpace;
    return cutPoint > 0
      ? textContent.substring(0, cutPoint) + "..."
      : truncated + "...";
  }
}

// Export singleton instance
export const notionRenderService = new NotionRenderService();
