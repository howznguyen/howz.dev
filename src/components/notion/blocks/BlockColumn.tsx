"use client";

import React from "react";
import type { Block } from "notion-types";

interface BlockColumnProps {
  block: Block;
  children?: React.ReactNode;
  className?: string;
}

export const BlockColumn: React.FC<BlockColumnProps> = ({
  block,
  children,
  className,
}) => {
  const ratio = block.format?.column_ratio || 0.5;

  return (
    <div
      className="flex-1 min-w-0"
      style={{ flexBasis: `${ratio * 100}%` }}
    >
      {children}
    </div>
  );
};

interface NotionColumnListProps {
  block: Block;
  children?: React.ReactNode;
  className?: string;
}

export const BlockColumnList: React.FC<NotionColumnListProps> = ({
  block,
  children,
  className,
}) => {
  return (
    <div className={`${className} my-4 flex gap-4 flex-col md:flex-row`}>
      {children}
    </div>
  );
};