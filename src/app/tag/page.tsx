import { MainTemplate } from "@/components/templates";
import { Tag } from "@/components/atoms";
import { Notion } from "@/services/notion/enhanced.service";
import { SITE_CONFIG } from "@/lib/constants";
import navigation from "@/datas/navigation";
import { categories } from "@/datas/categories";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: `All Tags | ${SITE_CONFIG.name}`,
  description: "Browse all tags on the blog",
};

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

export default async function TagsPage() {
  try {
    const tagsWithCounts = await Notion.getTagsWithCounts();

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
        <main className="layout">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              All Tags
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Browse posts by tags
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tagsWithCounts.map((tag: any, index: number) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <Tag name={tag.name} />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {tag.count} posts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </MainTemplate>
    );
  } catch (error) {
    console.error("Error loading tags page:", error);
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
        <main className="layout">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Tags
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Sorry, we couldn&apos;t load the tags page at this time.
            </p>
          </div>
        </main>
      </MainTemplate>
    );
  }
}
