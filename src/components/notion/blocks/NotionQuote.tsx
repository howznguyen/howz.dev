"use client";

import React from "react";
import type { Block } from "notion-types";
import { NotionRichText } from "./NotionRichText";

interface NotionQuoteProps {
  block: Block;
  children?: React.ReactNode;
  className?: string;
}

export const NotionQuote: React.FC<NotionQuoteProps> = ({
  block,
  children,
  className,
}) => {
  return (
    <blockquote className={`${className} my-4 pl-4 border-l-4 border-gray-300 dark:border-gray-600 italic text-gray-700 dark:text-gray-300`}>
      {block.properties?.title && (
        <NotionRichText value={block.properties.title} block={block} />
      )}
      {children}
    </blockquote>
  );
};