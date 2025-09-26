"use client";

import React, { useState } from "react";
import type { Block, ExtendedRecordMap } from "notion-types";
import Link from "next/link";
import Image from "next/image";
import cn from "classnames";

interface NotionBookmarkProps {
  block: Block;
  recordMap: ExtendedRecordMap;
}

export const NotionBookmark: React.FC<NotionBookmarkProps> = ({
  block,
  recordMap,
}: NotionBookmarkProps) => {
  const [coverError, setCoverError] = useState(false);
  const [iconError, setIconError] = useState(false);

  if (block.type !== "bookmark") return null;

  const url = block.properties?.link?.[0]?.[0] || "";
  const title = block.properties?.title?.[0]?.[0] || "";
  const description = block.properties?.description?.[0]?.[0] || "";
  const cover = block.format?.bookmark_cover || "";
  const icon = block.format?.bookmark_icon || "";

  if (!url) return null;

  return (
    <div className="mb-4 rounded-lg bg-white border border-gray-200 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "cursor-newtab relative",
          cover && !coverError
            ? "md:max-h-32 flex flex-col items-center md:flex-row"
            : "flex flex-col"
        )}
      >
        {cover && !coverError && (
          <Image
            loading="lazy"
            className="hidden md:block w-full md:h-32 md:w-48 object-cover rounded-tl-lg rounded-tr-lg md:rounded-tr-none md:rounded-bl-lg"
            width={1280}
            height={1920}
            src={cover}
            alt={title || "Bookmark cover"}
            onError={() => setCoverError(true)}
          />
        )}
        <div
          className={`w-full ${
            cover && !coverError ? "md:w-auto" : ""
          } flex flex-col justify-between p-4`}
        >
          <span className="mb-2 text-left text-sm md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white overflow-hidden leading-0 max-h-5 md:max-h-8">
            {title || url}
          </span>
          {description && (
            <div className="mb-3 font-normal text-xs md:text-base text-gray-700 dark:text-gray-400 overflow-hidden leading-4 max-h-8 md:max-h-12 md:h-14 text-left">
              {description}
            </div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400 w-full max-w-[600px] overflow-hidden max-h-6 md:h-6 flex items-center">
            {icon && !iconError ? (
              <Image
                width={20}
                height={20}
                src={icon}
                alt={title || "Site icon"}
                className="pl-0 p-1 inline mr-2"
                onError={() => setIconError(true)}
              />
            ) : (
              <svg
                className="w-4 h-4 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            )}
            <span className="py-1 truncate text-left">{url}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};
