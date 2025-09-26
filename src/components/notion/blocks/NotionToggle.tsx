"use client";

import React, { useState } from "react";
import type { Block, ExtendedRecordMap } from "notion-types";
import { NotionRichText } from "./NotionRichText";
import { useNotionContext } from "../NotionContext";

interface NotionToggleProps {
  block: Block;
  children?: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
  [key: string]: any; // Allow other props from react-notion-x
}

export const NotionToggle: React.FC<NotionToggleProps> = ({
  block,
  children,
  title: propTitle,
  className,
  ...props
}) => {
  console.log("NotionToggle component called!", { blockType: block.type, blockId: block.id });

  const [isShow, setShow] = useState(false);

  // Get recordMap from context
  const { recordMap } = useNotionContext();

  // Extract title from block properties or use provided title/children
  const renderTitle = () => {
    if (propTitle) {
      return propTitle;
    }

    if (block.properties?.title && block.properties.title.length > 0) {
      return <NotionRichText value={block.properties.title} block={block} />;
    }

    if (children) {
      return children;
    }

    return "Toggle";
  };

  // Render toggle content - similar to callout approach
  const renderContent = () => {
    // React-notion-x should pass rendered children - this is the primary content
    if (children) {
      return children;
    }

    // Try to manually render child blocks if recordMap is available
    if (recordMap && block.content && block.content.length > 0) {
      const childContent = block.content.map((childId: string) => {
        const childBlock = recordMap.block?.[childId]?.value;
        if (childBlock) {
          // Try to render different child block types
          if (childBlock.type === 'text' && childBlock.properties?.title) {
            return (
              <div key={childId} className="mb-2">
                <NotionRichText value={childBlock.properties.title} block={childBlock} />
              </div>
            );
          }

          // Handle other block types as needed
          return (
            <div key={childId} className="text-sm text-gray-600 mb-2">
              {childBlock.type} block (not implemented)
            </div>
          );
        }
        return null;
      }).filter(Boolean);

      if (childContent.length > 0) {
        return childContent;
      }
    }

    return <div className="text-gray-500 text-sm italic">No content available</div>;
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-start">
        <button
          className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center"
          onClick={() => setShow(!isShow)}
        >
          <svg
            className={`${
              isShow ? "rotate-90" : ""
            } transition-all duration-100 w-4 h-4`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        <span className="ml-2 text-lg font-bold text-gray-800 dark:text-gray-100">
          {renderTitle()}
        </span>
      </div>
      <div
        className={`pl-10 mt-2 transition-all duration-100 ${
          isShow ? "max-h-[100000px]" : "max-h-0"
        } overflow-hidden`}
      >
        {renderContent()}
      </div>
    </div>
  );
};
