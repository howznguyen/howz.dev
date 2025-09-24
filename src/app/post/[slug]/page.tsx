import {
  CommentSection,
  TableOfContents,
  PostList,
  Views,
} from "@/components/molecules";
import { NotionRenderer } from "@/components/notion";
import { MainTemplate, PageNotFound } from "@/components/templates";
import { Route, Image as ImageHelper } from "@/lib";
import { Notion } from "@/services/notion/enhanced.service";
import { NotionRenderService } from "@/services/notion/render.service";
import Image from "next/image";
import type { Metadata } from "next/types";
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

// No need for blogPostToPost helper; legacy service returns Post-compatible objects

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const blogPost = await Notion.getEnhancedPostBySlug(slug);
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
        publishedTime: blogPost.published_at,
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
import { Icon, LinkAtoms, Tag } from "@/components/atoms";
import moment from "moment";
import postData from "@/datas/post";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for ISR
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const posts = await Notion.getPosts();
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

    // Get page content with NotionX integration (if available in enhanced service)
    const pageContent = await Notion.getPageContent(blogPost.id);

    // Generate table of contents from enhanced headings
    const toc = NotionRenderService.extractHeadings(pageContent.apiBlocks);

    // Get related posts using enhanced service
    const relatedPostsData = await Notion.getRelatedPosts(
      blogPost.id,
      blogPost.tags,
      3
    );
    const relatedPosts = relatedPostsData.map((p: any) => ({
      ...p,
      status: "Published",
    }));

    // Convert main post to Post format for components
    const post = blogPost;

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
      datePublished: blogPost.published,
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
                  src={post.cover}
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
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {postData.published_at(post.published)}
            </p>
            <div className="mt-6 flex items-center justify-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <Icon icon="HiOutlineClock" />
                <span>{postData.reading_time(post.readingTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Views views={post.views} />
              </div>
            </div>

            {/* Social sharing buttons */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Share:
              </span>
              <LinkAtoms
                href={socialUrls.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors"
                aria-label="Share on Twitter"
              >
                <Icon icon="FaTwitter" />
              </LinkAtoms>
              <LinkAtoms
                href={socialUrls.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors"
                aria-label="Share on Facebook"
              >
                <Icon icon="FaFacebook" />
              </LinkAtoms>
              <LinkAtoms
                href={socialUrls.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-800 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Icon icon="FaLinkedin" />
              </LinkAtoms>
            </div>
          </div>

          <hr className="dark:border-gray-600" />

          <div className="lg:grid lg:grid-cols-[auto,250px] lg:gap-4 mt-4">
            <section className="md:mr-6 leading-7 text-justify w-auto min-w-0 overflow-hidden">
              {/* Render content using NotionRenderer with render blocks */}
              {pageContent.apiBlocks && pageContent.apiBlocks.length > 0 ? (
                <NotionRenderer
                  blocks={NotionRenderService.blocksToRenderData(
                    pageContent.apiBlocks
                  )}
                />
              ) : (
                <div className="p-4 text-gray-500 border border-gray-200 rounded">
                  No content blocks found. Raw text content:{" "}
                  {pageContent.textContent?.substring(0, 200)}...
                </div>
              )}

              <span>
                {tags.tags}:{" "}
                {post.tags &&
                  post.tags.map((tag: any, index: number) => (
                    <Tag key={index} name={tag} />
                  ))}
              </span>
            </section>

            <div className="relative">
              {/* Enhanced table of contents */}
              <TableOfContents data={toc} />
            </div>

            {relatedPosts && relatedPosts.length > 0 && (
              <div className="md:col-span-2 mb-2 mt-4">
                <span className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {postData.relate_post}
                </span>
                <PostList posts={relatedPosts} limit={3} />
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
