"use client";

import React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";

interface NotionBlockquoteProps {
  block: Block;
  recordMap: ExtendedRecordMap;
  children?: React.ReactNode;
}

export const NotionBlockquote: React.FC<NotionBlockquoteProps> = ({
  block,
  recordMap,
  children
}) => {
  return (
    <blockquote className="p-4 my-4 border-l-[0.25rem] border-blockquote bg-gray-50 dark:bg-gray-800">
      {children}
    </blockquote>
  );
};