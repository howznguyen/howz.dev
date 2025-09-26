import { getUnofficialDatabase } from "./api.service";
import { getPage } from "./notion-x.service";
import { convertNotionResponseToPosts } from "./utils.service";
import { NotionRenderService } from "./render.service";
import { umamiService } from "@/services/umami/umami.service";
import type { Post } from "@/types";
import type { BlogPost, Tag, SearchResult } from "@/types/notion";
import type { NotionHeading } from "./render.service";

/**
 * Unified Notion Service
 * Combines all Notion functionality into a single, optimized service
 */
export class NotionService {
  private spaceId: string;
  private sourceId: string;
  private collectionViewId: string;
  private notionTokenV2: string;
  private notionActiveUser: string;
  private notionApiWeb: string;
  private postsCache: Map<string, Post[]> = new Map();

  constructor() {
    this.spaceId = process.env.NOTION_SPACE_ID || "";
    this.sourceId = process.env.NOTION_POST_DATABASE_ID || "";
    this.collectionViewId = process.env.NOTION_POST_DATABASE_VIEW || "";
    this.notionTokenV2 = process.env.NOTION_TOKEN_V2 || "";
    this.notionActiveUser = process.env.NOTION_ACTIVE_USER || "";
    this.notionApiWeb = process.env.NOTION_API_WEB || "";

    // Only throw error in production, allow development with empty values
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
   * Get all posts from Notion database as Post[]
   */
  async getAllPosts(
    options: {
      tags?: string[];
      featured?: boolean;
      limit?: number;
      sortBy?: "date" | "views";
    } = {}
  ): Promise<Post[]> {
    const cacheKey = this.getPostsCacheKey(options);
    const cachedPosts = this.postsCache.get(cacheKey);
    if (cachedPosts) {
      return cachedPosts;
    }

    try {
      // Check if environment variables are available
      if (
        !this.spaceId ||
        !this.sourceId ||
        !this.collectionViewId ||
        !this.notionTokenV2 ||
        !this.notionActiveUser ||
        !this.notionApiWeb
      ) {
        console.warn(
          "Notion environment variables not configured, returning empty posts"
        );
        return [];
      }

      const rawResponse = await getUnofficialDatabase({
        spaceId: this.spaceId,
        sourceId: this.sourceId,
        collectionViewId: this.collectionViewId,
        notionTokenV2: this.notionTokenV2,
        notionActiveUser: this.notionActiveUser,
        notionApiWeb: this.notionApiWeb,
      });

      // Check if response is valid
      if (!rawResponse || !rawResponse.recordMap) {
        console.warn("Invalid response from Notion API:", rawResponse);
        return [];
      }

      let convertedPosts = convertNotionResponseToPosts(rawResponse);

      // Check if we got any posts
      if (!convertedPosts || convertedPosts.length === 0) {
        console.warn("No posts found in Notion response");
        return [];
      }

      convertedPosts = this.filterPublishedPosts(convertedPosts);

      // Apply filters
      if (options.tags && options.tags.length > 0) {
        convertedPosts = this.filterPostsByTags(convertedPosts, options.tags);
      }

      if (options.featured) {
        convertedPosts = this.filterFeaturedPosts(convertedPosts);
      }

      const sortBy = options.sortBy ?? "views";

      // Fetch views data if sorting by views
      if (sortBy === "views") {
        try {
          const viewsMap = await umamiService.getViewsMap();
          convertedPosts = convertedPosts.map((post) => ({
            ...post,
            views: post.slug ? viewsMap.get(post.slug) || 0 : 0,
          }));
          convertedPosts = convertedPosts.sort(
            (a, b) => (b.views || 0) - (a.views || 0)
          );
        } catch (error) {
          console.error("Error fetching views for sorting:", error);
          convertedPosts = this.sortPostsByDate(convertedPosts);
        }
      } else {
        convertedPosts = this.sortPostsByDate(convertedPosts);
      }

      if (options.limit) {
        convertedPosts = convertedPosts.slice(0, options.limit);
      }

      const posts = convertedPosts.map((post) => this.convertToPost(post));
      this.postsCache.set(cacheKey, posts);

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
  ): Promise<{
    posts: Post[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  }> {
    const { page = 1, perPage = 10 } = options;

    const allPosts = await this.getAllPosts(options);
    const total = allPosts.length;
    const totalPages = Math.ceil(total / perPage);
    const offset = (page - 1) * perPage;
    const posts = allPosts.slice(offset, offset + perPage);

    return {
      posts: posts,
      total,
      page,
      per_page: perPage,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1,
    };
  }

  /**
   * Build slug map for internal Notion page links
   */
  async getPostSlugMap(): Promise<Map<string, string>> {
    const posts = await this.getAllPosts();
    const map = new Map<string, string>();

    posts.forEach((post) => {
      if (!post.id || !post.slug) {
        return;
      }

      const rawId = post.id.replace(/-/g, "").toLowerCase();
      map.set(rawId, post.slug);
    });

    return map;
  }

  /**
   * Get single post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const allPosts = await this.getAllPosts();

      const post = allPosts.find((p) => p.slug === slug);

      if (!post) {
        console.log(`Post not found for slug: "${slug}"`);
        return null;
      }

      const pageContent = await this.getPageContent(post.id);
      const readingTime = this.calculateReadingTime(pageContent.textContent);

      let views = 0;
      try {
        const viewsMap = await umamiService.getViewsByPostSlug(slug);
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
        status: post.status,
        createdAt: new Date(post.createdAt).toISOString(),
        updatedAt: new Date(post.updatedAt).toISOString(),
        tags: post.tags,
        category: "Others",
        author: "Howz Nguyen",
        featured: post.featured,
        cover: post.cover
          ? {
              url: typeof post.cover === "string" ? post.cover : post.cover.url,
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
   * Get posts by tag as Post[]
   */
  async getPostsByTag(tag: string): Promise<Post[]> {
    try {
      const allPosts = await this.getAllPosts();
      const filteredPosts = allPosts.filter((post) =>
        post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase())
      );
      return filteredPosts;
    } catch (error) {
      console.error("Error in getPostsByTag:", error);
      throw new Error("Failed to fetch posts by tag");
    }
  }

  /**
   * Get related posts as Post[]
   */
  async getRelatedPosts(
    currentPostId: string,
    currentPostTags: string[],
    limit: number = 3
  ): Promise<Post[]> {
    try {
      const allPosts = await this.getAllPosts();
      const currentPost = allPosts.find((post) => post.id === currentPostId);

      if (!currentPost) {
        return [];
      }

      const relatedPosts = allPosts
        .filter(
          (post) =>
            post.id !== currentPost.id &&
            post.tags.some((tag) => currentPostTags.includes(tag))
        )
        .slice(0, limit);

      return relatedPosts;
    } catch (error) {
      console.error("Error in getRelatedPosts:", error);
      return [];
    }
  }

  /**
   * Get featured posts as Post[]
   */
  async getFeaturedPosts(limit: number = 5): Promise<Post[]> {
    try {
      return await this.getAllPosts({ featured: true, limit });
    } catch (error) {
      console.error("Error in getFeaturedPosts:", error);
      return [];
    }
  }

  /**
   * Get all unique tags
   */
  async getTags(): Promise<Tag[]> {
    try {
      const allPosts = await this.getAllPosts();
      const tagNames = allPosts.flatMap((post) => post.tags);

      // Remove duplicates first
      const uniqueTagNames = [...new Set(tagNames)];

      return uniqueTagNames.map((name, index) => ({
        id: `tag-${index}`,
        name,
        slug: this.generateSlug(name),
        count: allPosts.filter((post) => post.tags.includes(name)).length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error in getTags:", error);
      return [];
    }
  }

  /**
   * Get tags with counts
   */
  async getTagsWithCounts(): Promise<{ name: string; count: number }[]> {
    try {
      const allPosts = await this.getAllPosts();
      const tagCounts = new Map<string, number>();
      allPosts.forEach((post) => {
        post.tags.forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });

      return Array.from(tagCounts.entries()).map(([name, count]) => ({
        name,
        count,
      }));
    } catch (error) {
      console.error("Error in getTagsWithCounts:", error);
      return [];
    }
  }

  /**
   * Search posts
   */
  async searchPosts(query: string): Promise<SearchResult[]> {
    try {
      const allPosts = await this.getAllPosts();
      const filteredPosts = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.description?.toLowerCase().includes(query.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      );

      return filteredPosts.map((post) => ({
        id: post.id,
        type: "post" as const,
        title: post.title,
        slug: post.slug || "",
        description: post.description || "",
        excerpt: post.description || "",
        relevance: this.calculateRelevance(post, query),
        tags: post.tags,
        category: "Others",
      }));
    } catch (error) {
      console.error("Error in searchPosts:", error);
      throw new Error("Failed to search posts");
    }
  }

  /**
   * Get page content with blocks
   */
  async getPageContent(pageId: string) {
    try {
      const recordMap = await getPage(pageId);
      const textContent = NotionRenderService.extractPlainText(recordMap);
      const headings = NotionRenderService.extractHeadings(recordMap, pageId);

      return {
        recordMap,
        textContent,
        headings,
      };
    } catch (error) {
      console.error("Error in getPageContent:", error);
      throw new Error("Failed to get page content");
    }
  }

  /**
   * Get page content with NotionX for better rendering
   */
  async getPageContentWithNotionX(pageId: string) {
    try {
      const recordMap = await getPage(pageId);
      const textContent = NotionRenderService.extractPlainText(recordMap);
      const headings = NotionRenderService.extractHeadings(recordMap, pageId);

      return {
        recordMap,
        textContent,
        headings,
      };
    } catch (error) {
      console.error("Error in getPageContentWithNotionX:", error);
      throw new Error("Failed to get page content with NotionX");
    }
  }

  // Helper methods
  private getPostsCacheKey(options: {
    tags?: string[];
    featured?: boolean;
    limit?: number;
    sortBy?: "date" | "views";
  }): string {
    const normalized = {
      ...options,
      tags: options.tags ? [...options.tags].sort() : undefined,
    };

    return JSON.stringify(normalized);
  }

  private convertToPost(post: any): Post {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug || "",
      description: post.description || undefined,
      content: Array.isArray(post.content)
        ? post.content.join("\n")
        : post.content || undefined,
      status: post.status || "Draft",
      tags: post.tags,
      featured: post.featured,
      cover: post.cover || undefined,
      author: "Howz Nguyen",
      readingTime: post.readingTime || 5,
      views: post.views,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  private filterPublishedPosts(posts: Post[]): Post[] {
    return posts.filter((post) => post.status === "Published");
  }

  private sortPostsByDate(posts: Post[]): Post[] {
    return posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  private filterPostsByTags(posts: Post[], tags: string[]): Post[] {
    return posts.filter((post) => tags.some((tag) => post.tags.includes(tag)));
  }

  private filterFeaturedPosts(posts: Post[]): Post[] {
    return posts.filter((post) => post.featured);
  }

  private calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  }

  private calculateRelevance(post: Post, query: string): number {
    const queryLower = query.toLowerCase();
    let score = 0;

    if (post.title.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    if (
      post.description &&
      post.description.toLowerCase().includes(queryLower)
    ) {
      score += 5;
    }

    const matchingTags = post.tags.filter((tag) =>
      tag.toLowerCase().includes(queryLower)
    );
    score += matchingTags.length * 3;

    return score;
  }

  private cleanText(text: string): string {
    if (!text) return "";
    return text.replace(/\n/g, " ").trim();
  }

  private generateSlug(text: string): string {
    if (!text) return "untitled";

    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /**
   * Get posts for sitemap
   */
  async getPostsForSitemap(): Promise<any[]> {
    try {
      const posts = await this.getAllPosts();
      return posts.map((post) => ({
        url: `/post/${post.slug}`,
        lastModified: new Date(post.updatedAt).toISOString(),
        changeFrequency: "weekly",
        priority: 0.8,
        published: new Date(post.createdAt).toISOString(),
      }));
    } catch (error) {
      console.error("Error in getPostsForSitemap:", error);
      return [];
    }
  }

  /**
   * Get posts for RSS feed
   */
  async getPostsForRSS(): Promise<any[]> {
    try {
      const posts = await this.getAllPosts();
      return posts.map((post) => ({
        title: post.title,
        description: post.description || "",
        url: `/post/${post.slug}`,
        date: post.createdAt,
      }));
    } catch (error) {
      console.error("Error in getPostsForRSS:", error);
      return [];
    }
  }
}

// Export singleton instance
export const notionService = new NotionService();
export default notionService;
