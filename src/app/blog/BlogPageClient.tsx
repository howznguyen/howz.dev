"use client";

import { PostList } from "@/components/molecules";
import type { Post } from "@/types";
import blog from "@/datas/blog";
import removeAccents from "remove-accents";
import { useState } from "react";

interface BlogPageClientProps {
  initialPosts: Post[];
}

export function BlogPageClient({ initialPosts }: BlogPageClientProps) {
  const [statePosts, setStatePosts] = useState<Post[]>(initialPosts);

  const findPosts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    
    if (searchValue === '') {
      setStatePosts(initialPosts);
      return;
    }

    let filteredPosts = initialPosts.filter((post: Post) => {
      return removeAccents(post.title.toLowerCase()).includes(
        removeAccents(searchValue)
      ) || removeAccents(post.description?.toLowerCase() || '').includes(
        removeAccents(searchValue)
      ) || post.tags.some(tag => 
        removeAccents(tag.toLowerCase()).includes(removeAccents(searchValue))
      );
    });
    setStatePosts(filteredPosts);
  };

  return (
    <>
      <div className="mt-2 flex items-center justify-center w-full">
        <input
          type="text"
          className="w-full max-w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          placeholder={blog.find_posts}
          onChange={findPosts}
        />
      </div>

      <div className="mt-4">
        <PostList posts={statePosts} />
        {statePosts.length === 0 && (
          <h2 className="mt-8 text-center text-2xl dark:text-white font-bold">
            {blog.not_found_post}
          </h2>
        )}
      </div>
    </>
  );
}