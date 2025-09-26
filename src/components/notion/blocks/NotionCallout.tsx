"use client";

import React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";
import { NotionRichText } from "./NotionRichText";
import { useNotionContext } from "../NotionContext";

interface NotionCalloutProps {
  block: Block;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any; // Allow other props from react-notion-x
}

export const NotionCallout: React.FC<NotionCalloutProps> = ({
  block,
  className,
  children,
  ...props
}) => {
  // Get recordMap from context
  const { recordMap } = useNotionContext();

  // Extract emoji from different possible locations
  const emoji =
    block.format?.page_icon ||
    block.format?.icon ||
    block.properties?.icon?.[0]?.[0] ||
    "💡";

  // Content rendering with multiple approaches
  const renderContent = () => {
    // If react-notion-x provides children, use them (this is the proper way)
    if (children) {
      return children;
    }

    // Try to manually render child blocks if recordMap is available
    if (recordMap && block.content && block.content.length > 0) {
      const childContent = block.content
        .map((childId: string) => {
          const childBlock = recordMap.block?.[childId]?.value;
          if (childBlock) {
            // Try to render different child block types
            if (childBlock.type === "text" && childBlock.properties?.title) {
              return (
                <div key={childId}>
                  <NotionRichText
                    value={childBlock.properties.title}
                    block={childBlock}
                  />
                </div>
              );
            }

            // Handle other block types as needed
            return (
              <div key={childId} className="text-sm text-gray-600">
                {childBlock.type} block (not implemented)
              </div>
            );
          }
          return null;
        })
        .filter(Boolean);

      if (childContent.length > 0) {
        return childContent;
      }
    }

    // Fallback
    return (
      <div className="text-gray-500 text-sm italic">No content available</div>
    );
  };

  return (
    <div className="p-3 mb-4 flex items-center bg-gray-100 rounded-lg dark:bg-gray-800 w-full max-w-none">
      <span className="text-lg mr-3 text-gray-500 dark:text-gray-400">
        {emoji}
      </span>
      <span className="text-base text-gray-900 dark:text-white">
        {renderContent()}
      </span>
    </div>
  );
};
