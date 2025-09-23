"use client";

import { PostCard } from ".";
import { Loading } from "@/components/atoms";
import { Post } from "@/types";

interface PostListProps {
  posts: Post[];
  limit?: number;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  showLoadingCards?: boolean;
}

const LoadingCard = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

const PostList = ({ 
  posts, 
  limit, 
  className = "",
  loading = false,
  emptyMessage = "Không có bài viết nào.",
  showLoadingCards = true,
}: PostListProps) => {
  // Show loading state
  if (loading && posts.length === 0) {
    if (showLoadingCards) {
      return (
        <div className={`grid grid-cols-1 gap-5 place-items-stretch md:grid-cols-3 ${className}`}>
          {Array.from({ length: limit || 6 }).map((_, index) => (
            <LoadingCard key={`loading-${index}`} />
          ))}
        </div>
      );
    }
    
    return (
      <div className="flex justify-center py-12">
        <Loading />
      </div>
    );
  }

  // Show empty state
  if (!loading && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {emptyMessage}
        </p>
      </div>
    );
  }

  // Show posts
  const displayPosts = limit ? posts.slice(0, limit) : posts;

  return (
    <div className={`grid grid-cols-1 gap-5 place-items-stretch md:grid-cols-3 ${className}`}>
      {displayPosts.map((post: Post, index: number) => (
        <PostCard key={post.id || index} post={post} />
      ))}
      
      {/* Show loading cards for additional content */}
      {loading && posts.length > 0 && showLoadingCards && (
        <>
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingCard key={`additional-loading-${index}`} />
          ))}
        </>
      )}
    </div>
  );
};

export default PostList;
