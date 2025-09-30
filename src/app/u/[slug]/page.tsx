import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostList } from "@/components/molecules";
import { BlogLayout } from "@/components/layouts";
import Notion from "@/services/notion";
import Image from "next/image";
import site from "@/datas/site";
import { SITE_CONFIG } from "@/lib";
import categories from "@/datas/categories";
import navigation from "@/datas/navigation";

interface AuthorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { author, posts } = await Notion.getPostByUserSlug(slug);

  if (!author) {
    return {
      title: "Author Not Found",
    };
  }

  return {
    title: `Author ${author.name}${site.branding.title_suffix}`,
    description: `Posts by ${author.name}`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const { author, posts } = await Notion.getPostByUserSlug(slug);

  if (!author || !posts || posts.length === 0) {
    notFound();
  }

  return (
    <BlogLayout
      settings={{
        site_name: SITE_CONFIG.name,
        site_description: SITE_CONFIG.description,
        author: SITE_CONFIG.author,
        categories,
      }}
      navigation={navigation}
    >
      {/* Author Header */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {author.avatar && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {author.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </p>
          </div>
        </div>
      </div>

      {/* Posts List */}
      {posts.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Posts by {author.name}
          </h2>
          <PostList posts={posts} />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No posts found by this author.
          </p>
        </div>
      )}
    </BlogLayout>
  );
}
