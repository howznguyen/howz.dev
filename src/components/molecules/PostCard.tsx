"use client";

import Link from "next/link";
import Image from "next/image";
import { Route, Image as ImageHelper } from "@/lib";
import { DateTime, Icon, Tag } from "../atoms";
import { Post } from "@/types";
import postData from "@/datas/post";
import Views from "./Views";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  // Handle different post types
  const postInfo = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    description: post.description,
    cover: post.cover,
    tags: post.tags,
    published: post.published,
    readingTime: post.readingTime || 0,
    views: post.views || 0,
  };

  return (
    <article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg bg-white dark:bg-gray-800 dark:hover:shadow-sky-900">
      <Link
        className="block overflow-hidden"
        href={Route.post(postInfo.slug || "")}
      >
        <div className="relative">
          {postInfo.cover && (
            <div className="relative aspect-[16/9] bg-gray-200">
              <Image
                src={postInfo.cover}
                alt={postInfo.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${ImageHelper.generaterImagePlaceholder()}`}
                className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
          )}

          {postInfo.cover && postInfo.tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {postInfo.tags.map((tag: string, index: number) => (
                <Tag key={index} name={tag} />
              ))}
            </div>
          )}
        </div>

        {!postInfo.cover && postInfo.tags.length > 0 && (
          <div className="p-4 pb-0 flex flex-wrap gap-1">
            {postInfo.tags.map((tag: string, index: number) => (
              <Tag key={index} name={tag} />
            ))}
          </div>
        )}

        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2">
            {postInfo.title}
          </h3>

          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {postInfo.readingTime && (
              <div className="flex items-center gap-1">
                <Icon icon="HiOutlineClock" />
                <span>{postData.reading_time(postInfo.readingTime)}</span>
              </div>
            )}
            <Views views={postInfo.views} />
            {postInfo.published && <DateTime value={postInfo.published} />}
          </div>

          {postInfo.description && (
            <p className="mt-2 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
              {postInfo.description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
