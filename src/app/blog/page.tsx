import { PostList } from "@/components/molecules";
import { MainTemplate } from "@/components/templates";
import { Route } from "@/lib";
import { Notion } from "@/services/notion/enhanced.service";
import type { BlogPost } from "@/types/notion";
import type { Post } from "@/types";
import blog from "@/datas/blog";
import navigation from "@/datas/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { categories } from "@/datas/categories";
import { BlogPageClient } from "./BlogPageClient";
import type { Metadata } from "next/types";

// Helper function to convert BlogPost to Post
function blogPostToPost(blogPost: BlogPost): Post {
  return {
    id: blogPost.id,
    title: blogPost.title,
    slug: blogPost.slug,
    description: blogPost.description,
    content: blogPost.content,
    published: blogPost.published_at,
    status: blogPost.published ? 'Published' : 'Draft',
    tags: blogPost.tags,
    featured: blogPost.featured,
    cover: blogPost.cover?.url,
    author: blogPost.author,
    readingTime: blogPost.reading_time || 5,
    views: blogPost.views, // Pass views from BlogPost
  };
}

// Generate metadata for SEO
export const metadata: Metadata = {
  title: `${blog.blog} | Howz.dev`,
  description: blog.intro,
  openGraph: {
    title: `${blog.blog} | Howz.dev`,
    description: blog.intro,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: `${blog.blog} | Howz.dev`,
    description: blog.intro,
  },
};

// Enable ISR with 30 minutes revalidation
export const revalidate = 1800;

export default async function BlogPage() {
  try {
    // Get all posts sorted by views for ISR
    const posts = await Notion.getAllPosts({ sortBy: 'views' });
    const convertedPosts = posts.map((post) => blogPostToPost({
      id: post.id,
      title: post.title,
      slug: post.slug || '',
      description: post.description || '',
      content: '',
      excerpt: post.description || '',
      published: true,
      published_at: post.published?.toISOString() || new Date().toISOString(),
      created_at: new Date(post.createdTime).toISOString(),
      updated_at: new Date(post.lastEditedTime).toISOString(),
      tags: post.tags,
      category: 'Others',
      author: 'Howz Nguyen',
      featured: post.featured,
      cover: post.cover ? { url: post.cover, alt: post.title } : undefined,
      reading_time: post.readingTime || 5,
      views: post.views || 0, // Views data from Umami
    }));

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
          <h1 className="text-3xl md:text-5xl font-semibold">
            {blog.blog}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {blog.intro}
          </p>

          {/* Client-side search and filtering */}
          <BlogPageClient initialPosts={convertedPosts} />
        </div>
      </MainTemplate>
    );
  } catch (error) {
    console.error('Error in BlogPage:', error);
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
          <h1 className="text-3xl md:text-5xl font-semibold">
            {blog.blog}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Error loading posts. Please try again later.
          </p>
        </div>
      </MainTemplate>
    );
  }
}
