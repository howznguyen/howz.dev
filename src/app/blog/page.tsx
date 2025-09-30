import { MainTemplate } from "@/components/templates";
import Notion from "@/services/notion";
import blog from "@/datas/blog";
import navigation from "@/datas/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { categories } from "@/datas/categories";
import { BlogPageClient } from "./BlogPageClient";
import type { Metadata } from "next/types";
import site from "@/datas/site";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: `${blog.blog}${site.branding.title_suffix}`,
  description: blog.intro,
  openGraph: {
    title: `${blog.blog}${site.branding.title_suffix}`,
    description: blog.intro,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${blog.blog}${site.branding.title_suffix}`,
    description: blog.intro,
  },
};

// Enable ISR with 2 minutes revalidation
export const revalidate = 120;

export default async function BlogPage() {
  try {
    // Get all posts as Post[] directly (no conversion needed)
    const convertedPosts = await Notion.getPosts({ sortBy: "views" });

    return (
      <MainTemplate
        options={{
          settings: {
            site_name: SITE_CONFIG.name,
            site_description: SITE_CONFIG.description,
            author: SITE_CONFIG.author,
            categories,
          },
          navigation,
        }}
      >
        <div className="layout py-12">
          <h1 className="text-3xl md:text-5xl font-semibold">{blog.blog}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{blog.intro}</p>

          {/* Client-side search and filtering */}
          <BlogPageClient initialPosts={convertedPosts} />
        </div>
      </MainTemplate>
    );
  } catch (error) {
    console.error("Error in BlogPage:", error);
    return (
      <MainTemplate
        options={{
          settings: {
            site_name: SITE_CONFIG.name,
            site_description: SITE_CONFIG.description,
            author: SITE_CONFIG.author,
            categories,
          },
          navigation,
        }}
      >
        <div className="layout py-12">
          <h1 className="text-3xl md:text-5xl font-semibold">{blog.blog}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Error loading posts. Please try again later.
          </p>
        </div>
      </MainTemplate>
    );
  }
}
