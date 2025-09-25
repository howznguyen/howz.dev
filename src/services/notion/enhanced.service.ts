import { UnofficialNotionService } from "./unofficial-api.service";
import { getPage } from "./notion-x.service";
import { convertRecordMapToApiBlocks } from "./utils.service";
import { NotionRenderService } from "./render.service";
import type { BlogPost } from "@/types/notion";
import type { NotionRenderBlock, NotionHeading } from "./render.service";

/**
 * Enhanced Notion Service
 * Combines UnofficialNotionService with NotionX for complete functionality
 */
export class EnhancedNotionService extends UnofficialNotionService {
  /**
   * Get page content with NotionX for better rendering
   */
  async getPageContentWithNotionX(pageId: string) {
    try {
      // Get the record map using NotionX
      const recordMap = await getPage(pageId);

      // Convert to API blocks for compatibility
      const apiBlocks = convertRecordMapToApiBlocks(recordMap, pageId);

      // Extract text content
      const textContent = this.extractTextContentFromRecordMap(recordMap);

      // Get structured render data
      const renderBlocks = NotionRenderService.blocksToRenderData(apiBlocks);

      // Extract headings for TOC
      const headings = NotionRenderService.extractHeadings(apiBlocks);

      return {
        recordMap,
        textContent,
        blocks: recordMap.block ? Object.values(recordMap.block) : [],
        apiBlocks,
        renderBlocks,
        headings,
      };
    } catch (error) {
      console.error("Error in getPageContentWithNotionX:", error);
      throw error;
    }
  }

  /**
   * Get enhanced post by slug with NotionX content
   */
  async getEnhancedPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      // Get post metadata first
      const post = await this.getPostBySlug(slug);
      if (!post) {
        return null;
      }

      // Get enhanced content with NotionX
      const pageContent = await this.getPageContentWithNotionX(post.id);
      const readingTime = this.calculateReadingTimeFromText(
        pageContent.textContent
      );

      return {
        ...post,
        content: pageContent.textContent,
        reading_time: readingTime,
        recordMap: pageContent.recordMap,
        blocks: pageContent.blocks,
        apiBlocks: pageContent.apiBlocks,
        renderBlocks: pageContent.renderBlocks,
        headings: pageContent.headings,
        views: post.views,
      } as BlogPost & {
        recordMap: any;
        blocks: any[];
        apiBlocks: any[];
        renderBlocks: NotionRenderBlock[];
        headings: NotionHeading[];
      };
    } catch (error) {
      console.error("Error in getEnhancedPostBySlug:", error);
      return null;
    }
  }

  /**
   * Batch get posts with enhanced content
   */
  async getEnhancedPosts(
    options: {
      tags?: string[];
      featured?: boolean;
      limit?: number;
      includeContent?: boolean;
    } = {}
  ): Promise<BlogPost[]> {
    const { includeContent = false, ...otherOptions } = options;

    // Get posts metadata
    const posts = await this.getAllPosts(otherOptions);

    if (!includeContent) {
      return Promise.all(posts.map((post) => this.convertPostToBlogPost(post)));
    }

    // Get enhanced content for each post
    const enhancedPosts = await Promise.all(
      posts.map(async (post) => {
        try {
          const pageContent = await this.getPageContentWithNotionX(post.id);
          const readingTime = this.calculateReadingTimeFromText(
            pageContent.textContent
          );

          const blogPost = await this.convertPostToBlogPost(post);
          return {
            ...blogPost,
            content: pageContent.textContent,
            reading_time: readingTime,
          };
        } catch (error) {
          console.error(`Error enhancing post ${post.id}:`, error);
          // Return basic post if enhancement fails
          return this.convertPostToBlogPost(post);
        }
      })
    );

    return enhancedPosts;
  }

  /**
   * Get posts for sitemap with essential data only
   */
  async getPostsForSitemap() {
    try {
      const posts = await this.getAllPosts();

      return posts.map((post) => ({
        slug: post.slug || "",
        lastModified: new Date(post.lastEditedTime).toISOString(),
        createdAt: new Date(post.createdTime).toISOString(),
      }));
    } catch (error) {
      console.error("Error in getPostsForSitemap:", error);
      return [];
    }
  }

  /**
   * Get posts for RSS feed
   */
  async getPostsForRSS() {
    try {
      const posts = await this.getAllPosts({ limit: 20 });

      return Promise.all(
        posts.map(async (post) => {
          const blogPost = await this.convertPostToBlogPost(post);
          return {
            title: blogPost.title,
            description: blogPost.description,
            url: `/post/${blogPost.slug}`,
            content: blogPost.description, // Use description for RSS
          };
        })
      );
    } catch (error) {
      console.error("Error in getPostsForRSS:", error);
      return [];
    }
  }

  /**
   * Get posts - main method like in old Notion.ts (renamed to avoid conflict)
   */
  async getPostsLegacy({
    filter = {},
    sort = {},
    language,
    tags,
  }: {
    filter?: any;
    sort?: any;
    language?: string;
    tags?: string[];
  } = {}) {
    try {
      const posts = await this.getAllPosts({ tags, limit: undefined });

      // Convert to format expected by existing code
      const convertedPosts = await Promise.all(
        posts.map(async (post) => {
          let readingTimeMinutes = 1;

          try {
            // Get content using NotionX for reading time calculation
            const pageContent = await this.getPageContentWithNotionX(post.id);
            if (pageContent.textContent) {
              readingTimeMinutes = this.calculateReadingTimeFromText(
                pageContent.textContent
              );
            }
          } catch (error) {
            console.warn(`Failed to get content for post ${post.id}:`, error);
            readingTimeMinutes = 5; // Default fallback
          }

          return {
            id: post.id,
            title: post.title,
            cover: post.cover || null,
            createdAt: new Date(post.createdTime).toISOString(),
            updatedAt: new Date(post.lastEditedTime).toISOString(),
            slug: post.slug,
            tags: post.tags,
            description: post.description,
            featured: post.featured,
            readingTime: readingTimeMinutes,
          };
        })
      );

      return convertedPosts;
    } catch (error) {
      console.error("Error in getPostsLegacy:", error);
      return [];
    }
  }

  /**
   * Get post by slug - compatible with old Notion.ts
   */
  async getPostBySlugLegacy(slug: string) {
    try {
      const post = await this.getPostBySlug(slug);
      if (!post) {
        return null;
      }

      // Get content using NotionX
      let contents: any[] = [];
      let readingTimeMinutes = 1;

      try {
        const pageContent = await this.getPageContentWithNotionX(post.id);
        contents = pageContent.apiBlocks;

        if (pageContent.textContent) {
          readingTimeMinutes = this.calculateReadingTimeFromText(
            pageContent.textContent
          );
        }
      } catch (error) {
        console.warn("Failed to get content via NotionX:", error);
        contents = [];
        readingTimeMinutes = 5;
      }

      return {
        id: post.id,
        title: post.title,
        cover: post.cover?.url || null,
        created_at: post.created_at,
        updated_at: post.updated_at,
        slug: post.slug,
        tags: post.tags,
        description: post.description,
        featured: post.featured,
        readingTime: readingTimeMinutes,
        contents: contents,
        views: post.views || 0,
      };
    } catch (error) {
      console.error("Error in getPostBySlugLegacy:", error);
      return null;
    }
  }

  /**
   * Get page - compatible with old Notion.ts
   */
  async getPageLegacy(id: string) {
    try {
      const recordMap = await getPage(id);
      return recordMap;
    } catch (error) {
      console.error("Error in getPageLegacy:", error);
      throw error;
    }
  }

  /**
   * Get page content - compatible with old Notion.ts
   */
  async getPageContentLegacy(id: string) {
    try {
      const recordMap = await this.getPageLegacy(id);
      const apiBlocks = convertRecordMapToApiBlocks(recordMap, id);
      return {
        recordMap,
        textContent: this.extractTextContentFromRecordMap(recordMap),
        blocks: recordMap.block ? Object.values(recordMap.block) : [],
        apiBlocks: apiBlocks,
      };
    } catch (error) {
      console.error("Error in getPageContentLegacy:", error);
      throw error;
    }
  }

  /**
   * Get post with NotionX - compatible with old Notion.ts
   */
  async getPostWithNotionXLegacy(slug: string) {
    try {
      const post = await this.getPostBySlug(slug);
      if (!post) {
        return null;
      }

      // Get full page content using NotionX
      const pageContent = await this.getPageContentWithNotionX(post.id);

      // Calculate reading time
      let readingTimeMinutes = 1;
      if (pageContent.textContent) {
        readingTimeMinutes = this.calculateReadingTimeFromText(
          pageContent.textContent
        );
      }

      return {
        id: post.id,
        title: post.title,
        cover: post.cover?.url || null,
        slug: post.slug,
        tags: post.tags,
        description: post.description,
        featured: post.featured,
        readingTime: readingTimeMinutes,
        contents: pageContent.apiBlocks,
        recordMap: pageContent.recordMap,
        views: post.views || 0,
      };
    } catch (error) {
      console.error("Error in getPostWithNotionXLegacy:", error);
      return null;
    }
  }

  /**
   * Get related posts - compatible with old Notion.ts
   */
  async getRelatedPostsLegacy(
    currentPostId: string,
    currentPostTags: string[],
    limit: number = 3
  ) {
    try {
      const relatedPosts = await super.getRelatedPosts(
        currentPostId,
        currentPostTags,
        limit
      );

      // Convert to format expected by existing code
      return Promise.all(
        relatedPosts.map(async (post) => {
          return {
            id: post.id,
            title: post.title,
            cover: post.cover?.url || null,
            slug: post.slug,
            tags: post.tags,
            description: post.description,
            featured: post.featured,
            readingTime: post.reading_time,
            createdAt: post.created_at,
            updatedAt: post.updated_at,
          };
        })
      );
    } catch (error) {
      console.error("Error in getRelatedPostsLegacy:", error);
      return [];
    }
  }

  /**
   * Get tags - compatible with old Notion.ts
   */
  async getTagsLegacy() {
    try {
      const tags = await super.getTags();
      return tags.map((tag) => tag.name);
    } catch (error) {
      console.error("Error in getTagsLegacy:", error);
      return [];
    }
  }

  /**
   * Get tags with counts
   */
  async getTagsWithCounts() {
    try {
      return await super.getTagsWithCounts();
    } catch (error) {
      console.error("Error in getTagsWithCounts:", error);
      return [];
    }
  }

  /**
   * Get posts by tag - compatible with old Notion.ts
   */
  async getPostsByTagLegacy(tag: string) {
    try {
      const posts = await super.getPostsByTag(tag);

      // Convert to format expected by existing code
      return Promise.all(
        posts.map(async (post) => {
          let readingTimeMinutes = 1;

          try {
            // Get content for reading time calculation
            const pageContent = await this.getPageContentWithNotionX(post.id);
            if (pageContent.textContent) {
              readingTimeMinutes = this.calculateReadingTimeFromText(
                pageContent.textContent
              );
            }
          } catch (error) {
            console.warn(`Failed to get content for post ${post.id}:`, error);
            readingTimeMinutes = post.reading_time || 5;
          }

          return {
            id: post.id,
            title: post.title,
            cover: post.cover?.url || null,
            slug: post.slug,
            tags: post.tags,
            description: post.description,
            featured: post.featured,
            readingTime: readingTimeMinutes,
          };
        })
      );
    } catch (error) {
      console.error("Error in getPostsByTagLegacy:", error);
      return [];
    }
  }

  /**
   * Search posts - compatible with old Notion.ts
   */
  async searchPostsLegacy(query: string, language?: string) {
    try {
      const results = await super.searchPosts(query);

      // Convert to format expected by existing code
      return results.map((result) => ({
        id: result.id,
        title: result.title,
        cover: null,
        slug: result.slug,
        tags: result.tags,
        description: result.description,
        featured: false,
        readingTime: 5, // Default
      }));
    } catch (error) {
      console.error("Error in searchPostsLegacy:", error);
      return [];
    }
  }

  /**
   * Health check method with NotionX integration
   */
  async healthCheck() {
    try {
      const posts = await this.getAllPosts({ limit: 1 });

      // Test NotionX functionality if we have posts
      let notionXStatus = "not_tested";
      if (posts.length > 0) {
        try {
          await this.getPageContentWithNotionX(posts[0].id);
          notionXStatus = "healthy";
        } catch (error) {
          notionXStatus = "unhealthy";
        }
      }

      return {
        status: "healthy",
        postsCount: posts.length,
        notionXStatus,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Helper method to extract text from NotionX record map (renamed to avoid conflict)
  private extractTextContentFromRecordMap(recordMap: any): string {
    if (!recordMap || !recordMap.block) return "";

    let textContent = "";

    Object.values(recordMap.block).forEach((block: any) => {
      if (block?.value?.properties?.title) {
        const title = block.value.properties.title;
        title.forEach((segment: any) => {
          if (segment && segment[0]) {
            textContent += segment[0] + " ";
          }
        });
      }
    });

    return textContent.trim();
  }

  // Helper method to calculate reading time (renamed to avoid conflict)
  private calculateReadingTimeFromText(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  }

  // Helper method to convert ConvertedPost to BlogPost (public version)
  private async convertPostToBlogPost(post: any): Promise<BlogPost> {
    return {
      id: post.id,
      slug: post.slug || "",
      title: post.title,
      description: post.description || "",
      content: "", // Will be loaded separately when needed
      excerpt: post.description || "",
      status: post.status,
      created_at: new Date(post.createdTime).toISOString(),
      updated_at: new Date(post.lastEditedTime).toISOString(),
      tags: post.tags,
      category: "Others",
      author: "Howz Nguyen",
      featured: post.featured,
      cover: post.cover
        ? {
            url: post.cover,
            alt: post.title,
          }
        : undefined,
      reading_time: 5, // Default, will be calculated when content is loaded
    };
  }

  /**
   * Render content blocks to structured data
   */
  renderContentBlocks(apiBlocks: any[]): NotionRenderBlock[] {
    return NotionRenderService.blocksToRenderData(apiBlocks);
  }

  /**
   * Extract headings from content for Table of Contents
   */
  extractHeadings(apiBlocks: any[]): NotionHeading[] {
    return NotionRenderService.extractHeadings(apiBlocks);
  }

  /**
   * Get content summary/excerpt from blocks
   */
  getContentSummary(apiBlocks: any[], maxLength: number = 160): string {
    return NotionRenderService.getContentSummary(apiBlocks, maxLength);
  }

  /**
   * Calculate reading time from content blocks
   */
  calculateReadingTimeFromBlocks(
    apiBlocks: any[],
    wordsPerMinute: number = 200
  ): number {
    return NotionRenderService.calculateReadingTime(apiBlocks, wordsPerMinute);
  }

  /**
   * Search within content blocks
   */
  searchInContentBlocks(apiBlocks: any[], query: string): boolean {
    return NotionRenderService.searchInContent(apiBlocks, query);
  }

  /**
   * Convert rich text to structured data for rendering
   */
  renderRichText(richText: any[]) {
    return NotionRenderService.richTextToReactData(richText);
  }
}

// Export singleton instance
export const enhancedNotionService = new EnhancedNotionService();

// Export Notion-like object for backward compatibility
export const Notion = {
  getPosts: enhancedNotionService.getPostsLegacy.bind(enhancedNotionService),
  getPostBySlug: enhancedNotionService.getPostBySlugLegacy.bind(
    enhancedNotionService
  ),
  getEnhancedPostBySlug: enhancedNotionService.getEnhancedPostBySlug.bind(
    enhancedNotionService
  ),
  getPage: enhancedNotionService.getPageLegacy.bind(enhancedNotionService),
  getPageContent: enhancedNotionService.getPageContentLegacy.bind(
    enhancedNotionService
  ),
  getPageContentWithNotionX:
    enhancedNotionService.getPageContentWithNotionX.bind(enhancedNotionService),
  getPostWithNotionX: enhancedNotionService.getPostWithNotionXLegacy.bind(
    enhancedNotionService
  ),
  getRelatedPosts: enhancedNotionService.getRelatedPostsLegacy.bind(
    enhancedNotionService
  ),
  getTags: enhancedNotionService.getTagsLegacy.bind(enhancedNotionService),
  getTagsWithCounts: enhancedNotionService.getTagsWithCounts.bind(
    enhancedNotionService
  ),
  getPostsByTag: enhancedNotionService.getPostsByTagLegacy.bind(
    enhancedNotionService
  ),
  searchPosts: enhancedNotionService.searchPostsLegacy.bind(
    enhancedNotionService
  ),
  getAllPosts: enhancedNotionService.getAllPosts.bind(enhancedNotionService),
  getPostsForSitemap: enhancedNotionService.getPostsForSitemap.bind(
    enhancedNotionService
  ),
  getPostsForRSS: enhancedNotionService.getPostsForRSS.bind(
    enhancedNotionService
  ),
};
