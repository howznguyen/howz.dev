import { getUnofficialDatabase } from "./api.service";
import { getPage } from "./notion-x.service";
import { umamiService } from "@/services/umami/umami.service";
import {
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
  type ConvertedPost,
} from "./utils.service";
import type {
  BlogPost,
  Tag,
  SearchQuery,
  SearchResult,
  PostsResponse,
} from "@/types/notion";

/**
 * Unofficial Notion API Service
 * Uses unofficial Notion API for better performance and more features
 */
export class UnofficialNotionService {
  private spaceId: string;
  private sourceId: string;
  private collectionViewId: string;
  private notionTokenV2: string;
  private notionActiveUser: string;
  private notionApiWeb: string;

  constructor() {
    this.spaceId = process.env.NOTION_SPACE_ID!;
    this.sourceId = process.env.NOTION_POST_DATABASE_ID!;
    this.collectionViewId = process.env.NOTION_POST_DATABASE_VIEW!;
    this.notionTokenV2 = process.env.NOTION_TOKEN_V2!;
    this.notionActiveUser = process.env.NOTION_ACTIVE_USER!;
    this.notionApiWeb = process.env.NOTION_API_WEB!;

    if (
      !this.spaceId ||
      !this.sourceId ||
      !this.collectionViewId ||
      !this.notionTokenV2 ||
      !this.notionActiveUser ||
      !this.notionApiWeb
    ) {
      throw new Error("Missing required Notion environment variables");
    }
  }

  /**
   * Get all posts from Notion database
   */
  async getAllPosts(
    options: {
      tags?: string[];
      featured?: boolean;
      limit?: number;
      sortBy?: "date" | "views";
    } = {}
  ): Promise<ConvertedPost[]> {
    try {
      const rawResponse = await getUnofficialDatabase({
        spaceId: this.spaceId,
        sourceId: this.sourceId,
        collectionViewId: this.collectionViewId,
        notionTokenV2: this.notionTokenV2,
        notionActiveUser: this.notionActiveUser,
        notionApiWeb: this.notionApiWeb,
      });

      let posts = convertNotionResponseToPosts(rawResponse);
      posts = filterPublishedPosts(posts);

      // Apply filters
      if (options.tags && options.tags.length > 0) {
        posts = filterPostsByTags(posts, options.tags);
      }

      if (options.featured) {
        posts = getFeaturedPosts(posts);
      }

      if (!options.sortBy) {
        options.sortBy = "views"; // Default to views sorting
      }

      // Fetch views data if sorting by views during ISR
      if (options.sortBy === "views") {
        try {
          // Use UmamiService directly instead of API call
          const viewsMap = await umamiService.getViewsMap();
          // Add views to posts
          posts = posts.map((post) => ({
            ...post,
            views: post.slug ? viewsMap.get(post.slug) || 0 : 0,
          }));

          // Sort by views (highest first)
          posts = posts.sort((a, b) => (b.views || 0) - (a.views || 0));
        } catch (error) {
          console.error("Error fetching views for sorting:", error);
          // Fallback to date sorting if views fetch fails
          posts = sortPostsByDate(posts);
        }
      } else {
        // Default: Sort by date (newest first)
        posts = sortPostsByDate(posts);
      }

      // Apply limit
      if (options.limit) {
        posts = posts.slice(0, options.limit);
      }

      return posts;
    } catch (error) {
      console.error("Error in getAllPosts:", error);
      throw new Error("Failed to fetch posts");
    }
  }

  /**
   * Get posts with pagination
   */
  async getPosts(
    options: {
      page?: number;
      perPage?: number;
      tags?: string[];
      featured?: boolean;
      sortBy?: "date" | "views";
    } = {}
  ): Promise<PostsResponse> {
    const { page = 1, perPage = 10 } = options;

    const allPosts = await this.getAllPosts(options);
    const total = allPosts.length;
    const totalPages = Math.ceil(total / perPage);
    const offset = (page - 1) * perPage;
    const posts = allPosts.slice(offset, offset + perPage);

    // Convert to BlogPost format
    const blogPosts: BlogPost[] = await Promise.all(
      posts.map(async (post) => this.convertToBlogPost(post))
    );

    return {
      posts: blogPosts,
      total,
      page,
      per_page: perPage,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1,
    };
  }

  /**
   * Get single post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const allPosts = await this.getAllPosts();
      const post = getPostBySlug(allPosts, slug);

      if (!post) {
        return null;
      }

      // Get full content
      const pageContent = await this.getPageContent(post.id);
      const readingTime = this.calculateReadingTime(pageContent.textContent);

      // Get views data from Umami
      let views = 0;
      try {
        const viewsMap = await umamiService.getUrlPageviews(slug);
        views = viewsMap;
      } catch (error) {
        console.error("Error fetching views for post:", slug, error);
      }

      return {
        id: post.id,
        slug: post.slug || "",
        title: post.title,
        description: post.description || "",
        content: pageContent.textContent,
        excerpt: post.description || "",
        published: Boolean(post.published),
        published_at: post.published?.toISOString() || new Date().toISOString(),
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
        reading_time: readingTime,
        views: views,
      };
    } catch (error) {
      console.error("Error in getPostBySlug:", error);
      return null;
    }
  }

  /**
   * Get page content with blocks
   */
  async getPageContent(pageId: string) {
    try {
      const recordMap = await getPage(pageId);
      const apiBlocks = convertRecordMapToApiBlocks(recordMap, pageId);
      const textContent = this.extractTextFromRecordMap(recordMap);

      return {
        recordMap,
        textContent,
        blocks: recordMap.block ? Object.values(recordMap.block) : [],
        apiBlocks,
      };
    } catch (error) {
      console.error("Error in getPageContent:", error);
      throw error;
    }
  }

  /**
   * Get all unique tags
   */
  async getTags(): Promise<Tag[]> {
    try {
      const allPosts = await this.getAllPosts();
      const tagNames = getAllTags(allPosts);

      return tagNames
        .map((name, index) => ({
          id: `tag-${index}`,
          name,
          slug: this.generateSlug(name),
          count: allPosts.filter((post) => post.tags.includes(name)).length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error("Error in getTags:", error);
      throw new Error("Failed to fetch tags");
    }
  }

  /**
   * Get posts by tag
   */
  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    try {
      const allPosts = await this.getAllPosts();
      const filteredPosts = getPostsByTag(allPosts, tag);

      return Promise.all(
        filteredPosts.map((post) => this.convertToBlogPost(post))
      );
    } catch (error) {
      console.error("Error in getPostsByTag:", error);
      throw new Error("Failed to fetch posts by tag");
    }
  }

  /**
   * Search posts
   */
  async searchPosts(query: string): Promise<SearchResult[]> {
    try {
      const allPosts = await this.getAllPosts();
      const filteredPosts = searchPosts(allPosts, query);

      return filteredPosts.map((post) => ({
        id: post.id,
        type: "post" as const,
        title: post.title,
        slug: post.slug || "",
        description: post.description || "",
        excerpt: post.description || "",
        relevance: this.calculateRelevance(post, query),
        published_at: post.published?.toISOString(),
        tags: post.tags,
        category: "Others",
      }));
    } catch (error) {
      console.error("Error in searchPosts:", error);
      throw new Error("Failed to search posts");
    }
  }

  /**
   * Get related posts
   */
  async getRelatedPosts(
    currentPostId: string,
    currentPostTags: string[],
    limit: number = 3
  ): Promise<BlogPost[]> {
    try {
      const allPosts = await this.getAllPosts();
      const currentPost = allPosts.find((post) => post.id === currentPostId);

      if (!currentPost) {
        return [];
      }

      const relatedPosts = getRelatedPosts(allPosts, currentPost, limit);

      return Promise.all(
        relatedPosts.map((post) => this.convertToBlogPost(post))
      );
    } catch (error) {
      console.error("Error in getRelatedPosts:", error);
      return [];
    }
  }

  /**
   * Get featured posts
   */
  async getFeaturedPosts(limit: number = 5): Promise<BlogPost[]> {
    try {
      const allPosts = await this.getAllPosts({ featured: true, limit });

      return Promise.all(allPosts.map((post) => this.convertToBlogPost(post)));
    } catch (error) {
      console.error("Error in getFeaturedPosts:", error);
      return [];
    }
  }

  // Helper methods
  private async convertToBlogPost(post: ConvertedPost): Promise<BlogPost> {
    return {
      id: post.id,
      slug: post.slug || "",
      title: post.title,
      description: post.description || "",
      content: "", // Will be loaded separately when needed
      excerpt: post.description || "",
      published: Boolean(post.published),
      published_at: post.published?.toISOString() || new Date().toISOString(),
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
      reading_time: post.readingTime || 5, // Use from ConvertedPost or default
      views: post.views, // Pass views from ConvertedPost
    };
  }

  private extractTextFromRecordMap(recordMap: any): string {
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

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  private calculateRelevance(post: ConvertedPost, query: string): number {
    const queryLower = query.toLowerCase();
    let score = 0;

    // Title match (highest weight)
    if (post.title.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // Description match
    if (
      post.description &&
      post.description.toLowerCase().includes(queryLower)
    ) {
      score += 5;
    }

    // Tags match
    const matchingTags = post.tags.filter((tag) =>
      tag.toLowerCase().includes(queryLower)
    );
    score += matchingTags.length * 3;

    return score;
  }
}

// Export singleton instance
export const notionService = new UnofficialNotionService();
