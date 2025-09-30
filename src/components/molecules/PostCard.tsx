"use client";

import Link from "next/link";
import Image from "next/image";
import { Route, Image as ImageHelper } from "@/lib";
import { DateTime, Icon, Tag, Users } from "../atoms";
import { Post } from "@/types";
import Views from "./Views";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg bg-white dark:bg-gray-800 dark:hover:shadow-sky-900">
      <Link
        className="block overflow-hidden"
        href={Route.post(post.slug || "")}
      >
        <div className="relative">
          {post.cover && (
            <div className="relative aspect-[16/9] bg-gray-200">
              <Image
                src={post.cover as string}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${ImageHelper.generaterImagePlaceholder()}`}
                className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
          )}

          {post.cover && post.tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {post.tags.map((tag: string, index: number) => (
                <Tag key={index} name={tag} asLink={false} />
              ))}
            </div>
          )}
        </div>

        {!post.cover && post.tags.length > 0 && (
          <div className="p-4 pb-0 flex flex-wrap gap-1">
            {post.tags.map((tag: any, index: number) => (
              <Tag
                key={index}
                name={typeof tag === "string" ? tag : tag.name || tag}
                asLink={false}
              />
            ))}
          </div>
        )}

        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2">
            {post.title}
          </h3>

          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <Users users={post.authors ?? []} />
          </div>

          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <Views views={post.views} />
            {post.createdAt && (
              <div className="flex items-center gap-1">
                <Icon icon="HiOutlineCalendar" />
                <DateTime value={post.createdAt} />
              </div>
            )}
          </div>

          {post.description && (
            <p className="mt-2 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
              {post.description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
