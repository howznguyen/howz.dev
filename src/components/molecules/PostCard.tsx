import Link from "next/link";
import Image from "next/image";
import { Route, Image as ImageHelper, useTrans } from "@/lib";
import { DateTime, Icon, Tag } from "../atoms";

interface PostCardProps {
  post: any;
}

const PostCard = ({ post }: PostCardProps) => {
  const trans = useTrans();
  
  return (
    <div className="w-full rounded-md border border-gray-300 bg-white dark:border-gray-600 dark:bg-dark scale-100 hover:scale-[1.02] active:scale-[0.97] motion-safe:transform-gpu transition duration-100 motion-reduce:hover:scale-100 animate-shadow">
      <Link
        href={Route.post(post.slug)}
        locale={post.language}
        className="block h-full rounded-md focus:outline-none focus-visible:ring focus-visible:ring-primary-300"
      >
        <div className="relative">
          <figure className="w-full aspect-[5/2] rounded-tl-md rounded-tr-md overflow-hidden">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw,
                     (max-width: 1200px) 50vw,
                      33vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${ImageHelper.generaterImagePlaceholder()}`}
              className="absolute inset-0 w-full h-full object-cover rounded-tl-md rounded-tr-md"
            />
          </figure>
          <div className="absolute bottom-0 w-full px-4 py-2 mt-2 flex flex-wrap-reverse justify-end gap-y-1 gap-x-1 text-sm text-black dark:text-gray-100">
            {post.tags.map((tag: any, index: number) => (
              <Tag key={index} name={tag} />
            ))}
          </div>
        </div>
        <div className="p-4">
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{post.title}</span>
          <div className="mt-2 flex items-center justify-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <Icon icon="HiOutlineClock"/>
              <span>{ trans.post.reading_time(post.readingTime) }</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon icon="HiEye"/>
              <span>{ trans.post.views(post.views) }</span>
            </div>
          </div>
          <p className="mt-4 mb-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-bold text-gray-800 dark:text-gray-100">
              <DateTime value={post.published.start} />
            </span>
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {post.description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
