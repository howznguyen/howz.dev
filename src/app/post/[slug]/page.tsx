import {
  CommentSection,
  TableOfContents,
  PostList,
  Views,
} from "@/components/molecules";
import { NotionRenderer } from "@/components/notion";
import { MainTemplate, PageNotFound } from "@/components/templates";
import { Route, Image as ImageHelper } from "@/lib";
import { convertBlogPostToPost } from "@/lib/adapters";
import Notion from "@/services/notion";
import Image from "next/image";
import type { Metadata } from "next/types";
import type { Post } from "@/types";
import {
  GISCUS_REPO,
  GISCUS_REPO_ID,
  GISCUS_CATEGORY,
  GISCUS_CATEGORY_ID,
} from "@/lib/env";
import { SITE_CONFIG } from "@/lib/constants";
import navigation from "@/datas/navigation";
import { categories } from "@/datas/categories";
import tags from "@/datas/tags";

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const blogPost = await Notion.getPostBySlug(slug);
    if (!blogPost) {
      return {
        title: "Post Not Found",
        description: "The requested post could not be found.",
      };
    }

    return {
      title: `${blogPost.title} | Howz.dev`,
      description: blogPost.description,
      keywords: blogPost.tags?.join(", "),
      openGraph: {
        title: blogPost.title,
        description: blogPost.description,
        images: blogPost.cover
          ? [
              {
                url: blogPost.cover.url,
                width: 800,
                height: 400,
                alt: blogPost.title,
              },
            ]
          : [],
        type: "article",
        publishedTime: blogPost.createdAt,
        authors: ["Howz Nguyen"],
        tags: blogPost.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: blogPost.title,
        description: blogPost.description,
        images: blogPost.cover ? [blogPost.cover] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }
}
import { DateTime, Icon, LinkAtoms, Tag } from "@/components/atoms";
import postData from "@/datas/post";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for ISR
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const posts = await Notion.getAllPosts();
    return posts.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for posts:", error);
    return [];
  }
}

// Enable ISR with 5 minutes revalidation
export const revalidate = 300;

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  try {
    console.log("Fetching post:", slug);

    // Get post with full content using enhanced Notion service
    const blogPost = await Notion.getPostBySlug(slug);
    console.log("Post fetched:", blogPost ? "success" : "not found");

    if (!blogPost) {
      console.log("Post not found, returning 404");
      return <PageNotFound />;
    }

    // Get page content using NotionX service
    const pageContent = await Notion.getPageContent(blogPost.id);

    // Build page URL mapping for react-notion-x internal references
    const postSlugMap = await Notion.getPostSlugMap();
    const pageUrlRecord: Record<string, string> = {};
    postSlugMap.forEach((postSlug, rawId) => {
      if (!postSlug) {
        return;
      }

      pageUrlRecord[rawId] = Route.post(postSlug);
    });

    // Generate table of contents from headings
    const toc = pageContent.headings;

    // Get related posts as Post[] directly (no conversion needed)
    const relatedPosts = await Notion.getRelatedPosts(
      blogPost.id,
      blogPost.tags,
      3
    );

    // Convert main post to unified Post shape for components
    const post = convertBlogPostToPost(blogPost);

    // Generate social sharing URLs
    const baseUrl = "https://howz.dev";
    const postUrl = `${baseUrl}/post/${slug}`;
    const socialUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        postUrl
      )}&text=${encodeURIComponent(blogPost.title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        postUrl
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        postUrl
      )}`,
    };

    // Generate structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blogPost.title,
      description: blogPost.description,
      author: {
        "@type": "Person",
        name: "Howz Nguyen",
      },
      datePublished: blogPost.createdAt,
      url: postUrl,
      mainEntityOfPage: postUrl,
    };

    const giscus = {
      GISCUS_REPO,
      GISCUS_REPO_ID,
      GISCUS_CATEGORY,
      GISCUS_CATEGORY_ID,
    };

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
        {/* Add structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <main className="layout">
          <div className="pb-4 dark:border-gray-600">
            {post.cover && (
              <div className="relative w-full aspect-[5/2] rounded-lg overflow-hidden mb-4">
                <Image
                  src={
                    typeof post.cover === "string" ? post.cover : post.cover.url
                  }
                  alt={blogPost.title}
                  fill
                  sizes="(max-width: 768px) 50vw,
                          (max-width: 1200px) 50vw,
                          100vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${ImageHelper.generaterImagePlaceholder()}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}

            <h1 className="text-xl font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl dark:text-white">
              {post.title}
            </h1>

            <div className="md:mt-6 mt-2 flex items-center justify-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 flex-wrap">
              <div className="flex items-center gap-1">
                <Icon icon="HiOutlineCalendar" />
                <span>Created: </span>
                <DateTime value={blogPost.createdAt} showTooltip={true} />
              </div>
              <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                <Icon
                  icon="HiOutlinePencil"
                  className="text-blue-600 dark:text-blue-400"
                />
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Updated:{" "}
                </span>
                <DateTime
                  value={blogPost.updatedAt}
                  showTooltip={true}
                  className="text-blue-700 dark:text-blue-300"
                />
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="HiOutlineClock" />
                <span>{postData.reading_time(post.readingTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Views views={post.views} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex md:items-center gap-2 md:gap-1 md:flex-row flex-col items-start">
                <div className="flex items-center gap-1 flex-row">
                  <Icon
                    icon="HiOutlineTag"
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Tags:{" "}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {post.tags &&
                    post.tags.map((tag: any, index: number) => (
                      <Tag
                        key={index}
                        name={typeof tag === "string" ? tag : tag.name || tag}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>

          <hr className="dark:border-gray-600" />

          <div className="lg:grid lg:grid-cols-[auto,250px] lg:gap-4 mt-4">
            <section className="md:mr-6 leading-7 text-justify w-auto min-w-0 overflow-hidden">
              <NotionRenderer
                recordMap={pageContent.recordMap}
                pageUrlMap={pageUrlRecord}
                className="notion-content"
              />
            </section>

            <div className="relative">
              {/* Enhanced table of contents */}
              <TableOfContents data={toc} />
            </div>

            {relatedPosts && relatedPosts.length > 0 && (
              <div className="md:col-span-2 mb-2 mt-4">
                <div className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                  <span>{postData.relate_post}</span>
                </div>
                <PostList posts={relatedPosts as Post[]} limit={3} />
              </div>
            )}

            <CommentSection giscus={giscus} slug={slug} />
          </div>
        </main>
      </MainTemplate>
    );
  } catch (error) {
    console.error("Error in PostPage:", error);
    return <PageNotFound />;
  }
}
