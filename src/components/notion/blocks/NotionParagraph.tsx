"use client";

import React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";

interface NotionParagraphProps {
  block: Block;
  recordMap: ExtendedRecordMap;
  children?: React.ReactNode;
}

export const NotionParagraph: React.FC<NotionParagraphProps> = ({
  block,
  recordMap,
  children
}) => {
  return (
    <div className="text-left font-medium text-gray-800 dark:text-gray-400 mb-4">
      {children}
    </div>
  );
};
