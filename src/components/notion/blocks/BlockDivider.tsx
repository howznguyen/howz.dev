"use client";

import React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";

interface BlockDividerProps {
  block: Block;
  recordMap: ExtendedRecordMap;
}

export const BlockDivider: React.FC<BlockDividerProps> = ({ block, recordMap }) => {
  return (
    <hr className="my-8 border-t border-gray-300 dark:border-gray-600" />
  );
};