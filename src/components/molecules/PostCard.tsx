import moment from "moment";
import Link from "next/link";
import Image from "next/image";
import { Route } from "@/lib";
import { HiEye, HiOutlineClock } from "react-icons/hi";

interface PostCardProps {
  post: any;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="w-full rounded-md border border-gray-300 bg-white dark:border-gray-600 dark:bg-dark scale-100 hover:scale-[1.02] active:scale-[0.97] motion-safe:transform-gpu transition duration-100 motion-reduce:hover:scale-100 animate-shadow">
      <Link
        href={Route.post(post.slug)}
        className="block h-full rounded-md focus:outline-none focus-visible:ring focus-visible:ring-primary-300"
      >
        <div className="relative">
          <figure className="w-full aspect-[5/2] rounded-tl-md rounded-tr-md overflow-hidden">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="absolute inset-0 w-full h-full object-cover rounded-tl-md rounded-tr-md"
            />
          </figure>
          <div className="absolute bottom-0 w-full px-4 py-2 mt-2 flex flex-wrap justify-end gap-y-1 gap-x-2 text-sm text-black dark:text-gray-100">
            {post.tags.map((tag: any, index: number) => (
              <button key={index} className="bg-opacity-80 dark:!bg-opacity-60 inline-block rounded-md px-1.5 py-0.5 font-medium transition-colors bg-gray-100 text-gray-700 hover:text-black disabled:bg-gray-200 disabled:text-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:text-white dark:disabled:bg-gray-600 dark:disabled:text-gray-500 focus:outline-none focus-visible:ring focus-visible:ring-primary-300 disabled:cursor-not-allowed" tabIndex={-1}>
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4">
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100">{post.title}</h4>
          <div className="mt-2 flex items-center justify-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <HiOutlineClock />
              <span>{post.readingTime} phút đọc</span>
            </div>
            <div className="flex items-center gap-1">
              <HiEye />
              <span>{post.views} lượt xem</span>
            </div>
          </div>
          <p className="mt-4 mb-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="font-bold text-gray-800 dark:text-gray-100">
              {moment(post.published.start).format("MMMM DD, YYYY")}
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
