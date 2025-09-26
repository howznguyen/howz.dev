"use client";

import React from "react";
import type { Block } from "notion-types";
import { NotionRichText } from "./NotionRichText";
import cn from "classnames";

interface NotionTextProps {
  block: Block;
  children?: React.ReactNode;
  className?: string;
}

export const NotionText: React.FC<NotionTextProps> = ({
  block,
  children,
  className,
}) => {
  return (
    <div className={cn(className, "mb-2 text-left")}>
      {block.properties?.title && (
        <NotionRichText value={block.properties.title} block={block} />
      )}
      {children}
    </div>
  );
};
