"use client";

import React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";
import { BlockRichText } from "./BlockRichText";
import cn from "classnames";
import { getColorClasses } from "@/lib/notion-color";

interface BlockListProps {
  block: Block;
  recordMap: ExtendedRecordMap;
  children?: React.ReactNode;
  ordered?: boolean;
  inheritedColor?: string;
}

const groupBlockContent = (blockMap: any): string[][] => {
  const output: string[][] = [];
  let lastType: string | undefined;
  let index = -1;

  for (const id of Object.keys(blockMap)) {
    const blockValue = blockMap[id]?.value;

    if (blockValue) {
      if (blockValue.content)
        for (const blockId of blockValue.content) {
          const blockType = blockMap[blockId]?.value?.type;

          if (blockType && blockType !== lastType) {
            index++;
            lastType = blockType;
            output[index] = [];
          }

          if (index > -1) {
            output[index]?.push(blockId);
          }
        }
    }

    lastType = undefined;
  }

  return output;
};

const getListNumber = (blockId: string, blockMap: any) => {
  const groups = groupBlockContent(blockMap);
  const group = groups.find((g) => g.includes(blockId));

  if (!group) {
    return;
  }

  return group.indexOf(blockId) + 1;
};

const getListNestingLevel = (blockId: string, blockMap: any): number => {
  let level = 0;
  let currentBlockId = blockId;

  while (true) {
    const parentId = blockMap[currentBlockId]?.value?.parent_id;

    if (!parentId) break;

    const parentBlock = blockMap[parentId]?.value;
    if (!parentBlock) break;

    if (parentBlock.type === "numbered_list") {
      level++;
      currentBlockId = parentId;
    } else {
      break;
    }
  }

  return level;
};

const getListStyle = (level: number): string => {
  const styles: string[] = ["decimal", "lower-alpha", "lower-roman"];
  const index = ((level % styles.length) + styles.length) % styles.length;
  return styles[index] as string;
};

export const BlockList: React.FC<BlockListProps> = ({
  block,
  recordMap,
  children,
  ordered,
  inheritedColor,
}) => {
  // Get color from block format or inherited color
  const blockColor = block.format?.block_color || inheritedColor;
  const colorClasses = getColorClasses(blockColor);
  // React-notion-x list logic implementation
  const wrapList = (content: React.ReactNode, start?: number) => {
    if (block.type === "numbered_list" || ordered) {
      const nestingLevel = getListNestingLevel(block.id, recordMap.block);
      return (
        <ol
          className={cn(
            "notion-list",
            "notion-list-numbered",
            "space-y-1",
            "font-medium",
            "text-left",
            "list-inside",
            "mb-2",
            colorClasses,
          )}
          style={{
            listStyleType: getListStyle(nestingLevel),
          }}
          start={start}
        >
          {content}
        </ol>
      );
    } else {
      return (
        <ul
          className={cn(
            "notion-list",
            "notion-list-disc",
            "space-y-1",
            "font-medium",
            "text-left",
            "list-disc",
            "list-inside",
            "mb-2",
            colorClasses,
          )}
        >
          {content}
        </ul>
      );
    }
  };

  let output: React.ReactNode | null = null;
  const isTopLevel =
    block.type !== recordMap.block[block.parent_id]?.value?.type;
  const start = getListNumber(block.id, recordMap.block);

  if (block.content) {
    const listItem = block.properties ? (
      <li>
        <BlockRichText value={block.properties.title} block={block} />
      </li>
    ) : null;

    if (block.type === "bulleted_list") {
      output = (
        <>
          {listItem}
          <ul
            className={cn(
              "notion-list",
              "notion-list-disc",
              "space-y-1",
              "font-medium",
              "list-disc",
              "list-inside",
              "mb-2",
              "pl-4",
            )}
          >
            {children}
          </ul>
        </>
      );
    } else {
      const nestingLevel = getListNestingLevel(block.id, recordMap.block);
      output = (
        <>
          {listItem}
          <ol
            className={cn(
              "notion-list",
              "notion-list-numbered",
              "space-y-1",
              "font-medium",
              "list-inside",
              "mb-2",
              "pl-4",
            )}
            style={{
              listStyleType: getListStyle(nestingLevel + 1),
            }}
          >
            {children}
          </ol>
        </>
      );
    }
  } else {
    output = block.properties ? (
      <li>
        <BlockRichText value={block.properties.title} block={block} />
      </li>
    ) : null;
  }

  return isTopLevel ? wrapList(output, start) : output;
};
