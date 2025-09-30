"use client";

import React from "react";
import type { Block } from "notion-types";
import { BlockRichText } from "./BlockRichText";
import { getColorClasses, getTextColorClasses } from "@/lib/notion-color";
import cn from "classnames";

interface BlockQuoteProps {
  block: Block;
  children?: React.ReactNode;
  className?: string;
}

export const BlockQuote: React.FC<BlockQuoteProps> = ({
  block,
  children,
  className,
}) => {
  const blockColor = block.format?.block_color;
  const colorClasses = getColorClasses(blockColor);

  // Get border color based on block color
  const getBorderColor = (color?: string) => {
    switch (color) {
      case "red":
        return "border-red-400 dark:border-red-600";
      case "blue":
        return "border-blue-400 dark:border-blue-600";
      case "green":
        return "border-green-400 dark:border-green-600";
      case "yellow":
        return "border-yellow-400 dark:border-yellow-600";
      case "orange":
        return "border-orange-400 dark:border-orange-600";
      case "purple":
        return "border-purple-400 dark:border-purple-600";
      case "pink":
        return "border-pink-400 dark:border-pink-600";
      case "gray":
        return "border-gray-400 dark:border-gray-600";
      case "brown":
        return "border-amber-400 dark:border-amber-600";
      default:
        return "border-gray-300 dark:border-gray-600";
    }
  };

  return (
    <blockquote
      className={cn(
        className,
        "my-4 pl-4 border-l-4 italic",
        getBorderColor(blockColor),
        blockColor ? colorClasses : "text-gray-700 dark:text-gray-300",
      )}
    >
      {block.properties?.title && (
        <BlockRichText value={block.properties.title} block={block} />
      )}
      {children}
    </blockquote>
  );
};
