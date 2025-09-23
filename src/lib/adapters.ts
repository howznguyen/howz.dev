import { Post, Tag } from "@/types";
import { ConvertedPost } from "@/services/notion/utils.service";

/**
 * Convert ConvertedPost to Post interface
 */
export function convertToPost(convertedPost: ConvertedPost): Post | null {
  if (!convertedPost.slug) {
    return null;
  }

  return {
    id: convertedPost.id,
    title: convertedPost.title,
    slug: convertedPost.slug,
    description: convertedPost.description || undefined,
    content: Array.isArray(convertedPost.content)
      ? convertedPost.content.join("\n")
      : convertedPost.content || undefined,
    published: convertedPost.published
      ? convertedPost.published.toISOString()
      : new Date().toISOString(),
    status: convertedPost.status as "Published" | "Draft" | "Archived",
    tags: convertedPost.tags,
    featured: convertedPost.featured,
    cover: convertedPost.cover || undefined,
    author: "Howz Nguyen", // Default author since not in ConvertedPost
    readingTime: convertedPost.readingTime,
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
