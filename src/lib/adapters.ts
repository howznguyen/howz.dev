import { Post, Tag, BasePost } from "@/types";
import { ConvertedPost } from "@/services/notion/utils.service";

/**
 * Convert ConvertedPost to Post interface
 */
export function convertToPost(convertedPost: ConvertedPost): Post | null {
  if (!convertedPost.slug) {
    return null;
  }

  const basePost: BasePost = {
    id: convertedPost.id,
    title: convertedPost.title,
    slug: convertedPost.slug,
    description: convertedPost.description || undefined,
    content: Array.isArray(convertedPost.content)
      ? convertedPost.content.join("\n")
      : convertedPost.content || undefined,
    status: convertedPost.status || "Draft",
    tags: convertedPost.tags,
    featured: convertedPost.featured,
    cover: convertedPost.cover || undefined,
    author: "Howz Nguyen", // Default author since not in ConvertedPost
    readingTime: convertedPost.readingTime,
    createdAt: new Date(convertedPost.createdTime).toISOString(),
    updatedAt: new Date(convertedPost.lastEditedTime).toISOString(),
  };

  return basePost;
}

/**
 * Convert BlogPost to Post interface
 */
export function convertBlogPostToPost(blogPost: any): Post {
  return {
    id: blogPost.id,
    title: blogPost.title,
    slug: blogPost.slug,
    description: blogPost.description,
    content: blogPost.content,
    status: blogPost.status,
    tags: blogPost.tags,
    featured: blogPost.featured,
    cover: blogPost.cover?.url || blogPost.cover,
    author: blogPost.author,
    readingTime: blogPost.reading_time || blogPost.readingTime,
    views: blogPost.views,
    createdAt: blogPost.created_at,
    updatedAt: blogPost.updated_at,
  };
}

/**
 * Convert array of ConvertedPost to Post array
 */
export function convertToPosts(convertedPosts: ConvertedPost[]): Post[] {
  return convertedPosts
    .map(convertToPost)
    .filter((post): post is Post => post !== null);
}

/**
 * Convert string array to Tag array
 */
export function convertToTags(tagStrings: string[]): Tag[] {
  const tagCounts: Record<string, number> = {};

  // Count occurrences if we have the data
  tagStrings.forEach((tag) => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });

  return Object.entries(tagCounts).map(([name, count]) => ({
    name,
    count,
  }));
}

/**
 * Convert tags from posts to Tag array with counts
 */
export function extractTagsFromPosts(posts: ConvertedPost[]): Tag[] {
  const tagCounts: Record<string, number> = {};

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
