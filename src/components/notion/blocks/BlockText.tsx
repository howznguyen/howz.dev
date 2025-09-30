"use client";

import React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";
import { BlockRichText } from "./BlockRichText";
import cn from "classnames";

interface BlockTextProps {
  block: Block;
  recordMap?: ExtendedRecordMap;
  children?: React.ReactNode;
  className?: string;
  isChild?: boolean;
}

export const BlockText: React.FC<BlockTextProps> = ({
  block,
  recordMap,
  children,
  className,
  isChild = false,
}) => {
  return (
    <div className={cn(className, !isChild ? "mb-2" : "", "text-left")}>
      {block.properties?.title && (
        <BlockRichText
          value={block.properties.title}
          block={block}
          recordMap={recordMap}
        />
      )}
      {children}
    </div>
  );
};
