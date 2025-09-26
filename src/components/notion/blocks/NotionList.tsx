"use client";

import React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";
import { NotionRichText } from "./NotionRichText";

interface NotionListProps {
  block: Block;
  recordMap?: ExtendedRecordMap;
  children?: React.ReactNode;
  ordered?: boolean;
  number?: number;
}

export const NotionList: React.FC<NotionListProps> = ({
  block,
  recordMap,
  children,
  ordered: propOrdered,
  number: propNumber,
}) => {
  const ordered = propOrdered || block.type === ("numbered_list" as any);
  const number = propNumber;
  if (ordered) {
    return (
      <ol
        start={number ?? 1}
        className="space-y-1 font-medium text-gray-800 list-decimal list-inside dark:text-gray-400 text-left"
      >
        {block.properties?.title && block.properties.title.length > 0 && (
          <li>
            <NotionRichText value={block.properties.title} block={block} />
          </li>
        )}
        {children}
      </ol>
    );
  }

  return (
    <ul className="notion-list space-y-1 font-medium text-gray-800 list-disc list-inside dark:text-gray-400 text-left">
      {block.properties?.title && block.properties.title.length > 0 && (
        <li>
          <NotionRichText value={block.properties.title} block={block} />
        </li>
      )}
      {children}
    </ul>
  );
};
