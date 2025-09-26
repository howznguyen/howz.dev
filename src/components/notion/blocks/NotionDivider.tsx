"use client";

import React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";

interface NotionDividerProps {
  block: Block;
  recordMap: ExtendedRecordMap;
}

export const NotionDivider: React.FC<NotionDividerProps> = ({ block, recordMap }) => {
  return (
    <hr className="my-8 border-t border-gray-300 dark:border-gray-600" />
  );
};