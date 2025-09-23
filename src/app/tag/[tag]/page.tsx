import { PostList } from "@/components/molecules";
import { MainTemplate, PageNotFound } from "@/components/templates";
import { Route } from "@/lib";
import { Notion } from "@/services/notion/enhanced.service";
import type { BlogPost } from "@/types/notion";
import type { Post } from "@/types";
import tags from "@/datas/tags";
import navigation from "@/datas/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { categories } from "@/datas/categories";
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
  };
}

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  
  try {
    const allTags = await Notion.getTags();
    const currentTag = allTags.find((t: string) => t.toLowerCase() === tag.toLowerCase());
    
    const title = currentTag 
      ? `Posts tagged with "${currentTag}" | Howz.dev`
      : `Posts tagged with "${tag}" | Howz.dev`;
    
    const description = `All posts tagged with ${currentTag || tag}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    };
  } catch (error) {
    return {
      title: `Posts tagged with "${tag}" | Howz.dev`,
      description: `All posts tagged with ${tag}`,
    };
  }
}

// Generate static params for ISR
export async function generateStaticParams(): Promise<Array<{ tag: string }>> {
  try {
    const allTags = await Notion.getTags();
    return allTags.map((tagName: string) => ({
      tag: tagName.toLowerCase(),
    }));
  } catch (error) {
    console.error('Error generating static params for tags:', error);
    return [];
  }
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;

  try {
    // Get posts by tag using enhanced service
    const fetchedBlogPosts = await Notion.getPostsByTag(tag);
    const posts = fetchedBlogPosts.map((post: any) => blogPostToPost({
      id: post.id,
      title: post.title,
      slug: post.slug,
      description: post.description,
      content: '',
      excerpt: post.description,
      published: true,
      published_at: post.published,
      created_at: post.published,
      updated_at: post.published,
      tags: post.tags,
      category: 'Others',
      author: 'Howz Nguyen',
      featured: post.featured,
      cover: post.cover ? { url: post.cover, alt: post.title } : undefined,
      reading_time: post.readingTime || 5,
      views: post.views || 0,
    }));

    // Get all tags for additional info
    const allTags = await Notion.getTags();
    const currentTag = allTags.find((t: string) => t.toLowerCase() === tag.toLowerCase());

    if (!currentTag && posts.length === 0) {
      return <PageNotFound />;
    }

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
            {tags.tag} #{currentTag || tag}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {tags.post_by_tag}
          </p>
          
          {currentTag && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
              </p>
            </div>
          )}

          <div className="mt-6">
            {posts.length > 0 && <PostList posts={posts} />}
            {posts.length === 0 && (
              <div className="text-center py-12">
                <h2 className="text-2xl dark:text-white font-bold mb-4">
                  {tags.not_found_post}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  No posts found for tag &quot;{tag}&quot;
                </p>
                <a 
                  href="/blog" 
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse All Posts
                </a>
              </div>
            )}
          </div>
        </div>
      </MainTemplate>
    );
  } catch (error) {
    console.error('Error in TagPage:', error);
    return <PageNotFound />;
  }
}
