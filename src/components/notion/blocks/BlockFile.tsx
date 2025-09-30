"use client";

import React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";
import { BlockRichText } from "./BlockRichText";

interface BlockFileProps {
  block: Block;
  recordMap: ExtendedRecordMap;
  className?: string;
  children?: React.ReactNode;
}

export const BlockFile: React.FC<BlockFileProps> = ({
  block,
  recordMap,
  className,
  children,
}) => {
  // Extract file information from block properties (based on actual Notion structure)
  const fileUrl =
    block.properties?.source?.[0]?.[0] || block.format?.display_source;
  const fileName = block.properties?.title?.[0]?.[0] || "Download File";
  const fileSize = block.format?.file_size;
  const blockColor = block.format?.block_color;

  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  // Function to get file extension from URL or filename
  const getFileExtension = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    return extension || "file";
  };

  // Function to get file icon based on extension
  const getFileIcon = (extension: string) => {
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "ppt":
      case "pptx":
        return "📽️";
      case "zip":
      case "rar":
        return "🗜️";
      case "mp3":
      case "wav":
        return "🎵";
      case "mp4":
      case "mov":
        return "🎬";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️";
      default:
        return "📁";
    }
  };

  // Function to get color classes based on block color
  const getColorClasses = (color: string) => {
    switch (color) {
      case "red":
        return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30";
      case "blue":
        return "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30";
      case "green":
        return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30";
      case "yellow":
        return "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30";
      case "purple":
        return "border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30";
      default:
        return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700";
    }
  };

  if (!fileUrl) {
    return (
      <div
        className={`${className} bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-4`}
      >
        <div className="text-gray-500 dark:text-gray-400">
          File not available
        </div>
      </div>
    );
  }

  const extension = getFileExtension(fileUrl);
  const icon = getFileIcon(extension);
  const colorClasses = blockColor
    ? getColorClasses(blockColor)
    : getColorClasses("default");

  return (
    <div className={`${className} my-4`}>
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center p-4 rounded-lg border transition-colors group ${colorClasses}`}
      >
        <div className="flex-shrink-0 text-2xl mr-3">{icon}</div>

        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-white truncate">
            {block.properties?.title ? (
              <BlockRichText value={block.properties.title} block={block} />
            ) : (
              fileName
            )}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="uppercase">{extension}</span>
            {fileSize && (
              <>
                <span>•</span>
                <span>{formatFileSize(fileSize)}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 ml-4">
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </a>
    </div>
  );
};
