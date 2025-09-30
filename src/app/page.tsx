import { Button } from "@/components/atoms";
import { IntroCard, PostList } from "@/components/molecules";
import { MainTemplate } from "@/components/templates";
import { Route } from "@/lib";
import Notion from "@/services/notion";
import type { Post } from "@/types";
import { SITE_CONFIG } from "@/lib/constants";
import { categories } from "@/datas/categories";
import navigation from "@/datas/navigation";
import home from "@/datas/home";
import Link from "next/link";
import type { Metadata } from "next/types";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | ${SITE_CONFIG.description}`,
  description: SITE_CONFIG.description,
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://howz.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
};

// Enable ISR with 5 minutes revalidation
export const revalidate = 300;

interface HomePageProps {
  featuredPosts: Post[];
  categoriesPosts: any[];
  head: any;
  options: any;
}

export default async function HomePage() {
  // Get all posts as Post[] directly (no conversion needed)
  let allPosts = await Notion.getPosts({
    limit: 50, // Get more posts for better categorization
  });

  // Get featured posts using helper function
  let featuredPosts = allPosts
    .filter((post: Post) => post.featured)
    .sort((a: Post, b: Post) => {
      const aReadingTime = a.readingTime || 0;
      const bReadingTime = b.readingTime || 0;
      return bReadingTime - aReadingTime;
    })
    .slice(0, 6);

  // If no featured posts, get most recent posts
  if (featuredPosts.length === 0) {
    featuredPosts = allPosts
      .sort(
        (a: Post, b: Post) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 6);
  }

  let categoriesPosts = categories.map((c: any) => {
    c.posts = allPosts
      .filter((post: Post) => {
        if (Array.isArray(c.value)) {
          return post.tags.some((tag: string) => c.value.includes(tag));
        } else {
          return post.tags.includes(c.value);
        }
      })
      .slice(0, 6); // Limit to 6 posts per category
    return c;
  });

  let head = {
    url: Route.index(true),
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
      <div className="layout mt-2">
        <section className="fade-in-start">
          <IntroCard />
        </section>

        {featuredPosts.length > 0 && (
          <section className="pb-5 md:pb-10 fade-in-start">
            <div data-fade="0" id="featured-post" className="scroll-mt-[70px]">
              <span className="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">
                {home.featured_posts}
              </span>
              <PostList posts={featuredPosts} limit={6} className="mt-3" />
              <Button className="mt-4 scale-100 hover:scale-[1.1] active:scale-[0.97] motion-safe:transform-gpu transition duration-100">
                <Link href={Route.blog()}>{home.read_more}</Link>
              </Button>
            </div>
          </section>
        )}

        {categoriesPosts
          .filter((category: any) => category.posts.length > 0)
          .map((category: any, index: number) => (
            <section key={index} className="py-5 md:py-10 fade-in-start">
              <div data-fade="0">
                <span className="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">
                  {category.name}
                </span>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {category.description}
                </p>
                <PostList posts={category.posts} limit={6} className="mt-3" />
                {category.posts.length > 6 && (
                  <Button className="mt-4 scale-100 hover:scale-[1.1] active:scale-[0.97] motion-safe:transform-gpu transition duration-100">
                    <Link
                      href={`${Route.blog()}?tag=${encodeURIComponent(
                        category.value,
                      )}`}
                    >
                      {home.read_more}
                    </Link>
                  </Button>
                )}
              </div>
            </section>
          ))}
      </div>
    </MainTemplate>
  );
}
