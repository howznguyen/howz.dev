import type { MetadataRoute } from "next";
import { Route } from "@/lib";
import notionService from "@/services/notion";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch posts and tags using unofficial service
    const posts = await notionService.getPosts();
    const tags = await notionService.getTags();

    // Convert posts to sitemap format
    const postsForSitemap = posts.map((post) => ({
      slug: post.slug || "",
      lastModified: new Date(post.updatedAt).toISOString(),
      published: new Date(post.createdAt).toISOString(),
    }));

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: Route.index(true),
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: Route.blog(true),
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
    ];

    // Dynamic post pages
    const postPages: MetadataRoute.Sitemap = postsForSitemap.map((post) => ({
      url: Route.post(post.slug, true),
      lastModified: new Date(post.lastModified),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    // Dynamic tag pages
    const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
      url: Route.tag.get(tag.name, true),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.4,
    }));

    return [...staticPages, ...postPages, ...tagPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return basic sitemap if there's an error
    return [
      {
        url: Route.index(true),
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: Route.blog(true),
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
    ];
  }
}
