"use client";

import React from "react";
import type { Block as BlockType } from "notion-types";
import { BlockToggle } from "./BlockToggle";
import { BlockRichText } from "./BlockRichText";
import { BlockCallout } from "./BlockCallout";
import { BlockCode } from "./BlockCode";
import { BlockHeading } from "./BlockHeading";
import { BlockImage } from "./BlockImage";
import { BlockList } from "./BlockList";
import { BlockTodo } from "./BlockTodo";
import { BlockQuote } from "./BlockQuote";
import { BlockColumn, BlockColumnList } from "./BlockColumn";
import { BlockText } from "./BlockText";
import { useNotionContext } from "../NotionContext";
import BlockEquation from "./BlockEquation";
import cn from "classnames";
import { BlockDivider } from "./BlockDivider";
import { BlockEmbed } from "./BlockEmbed";
import { BlockVideo } from "./BlockVideo";
import { BlockBookmark } from "./BlockBookmark";
import { BlockTable } from "./BlockTable";
import { BlockFile } from "./BlockFile";

interface BlockProps {
  block: BlockType;
  level: number;
  className?: string;
  children?: React.ReactNode;
}

export const Block: React.FC<BlockProps> = ({
  block,
  level,
  className,
  children,
}) => {
  const isNested = level > 1;
  const { recordMap } = useNotionContext();
  // Switch case to handle different block types
  switch (block.type) {
    case "toggle":
      return (
        <BlockToggle
          block={block}
          className={className}
          title={
            block.properties?.title ? (
              <BlockRichText value={block.properties.title} block={block} />
            ) : (
              "Toggle"
            )
          }
        >
          {children}
        </BlockToggle>
      );

    case "callout":
      return (
        <BlockCallout block={block} className={className}>
          {children}
        </BlockCallout>
      );

    case "code":
      return (
        <BlockCode block={block} recordMap={recordMap!}>
          {children}
        </BlockCode>
      );

    case "text":
      return (
        <BlockText
          block={block}
          className={className}
          recordMap={recordMap!}
          isChild={isNested}
        >
          {children}
        </BlockText>
      );

    case "header":
    case "sub_header":
    case "sub_sub_header":
      // Check if heading is toggleable (Toggle + Heading combination)
      if (block.format?.toggleable) {
        return (
          <BlockToggle
            block={block}
            className={className}
            title={
              <BlockHeading block={block} recordMap={recordMap!} isChild={true}>
                {children}
              </BlockHeading>
            }
          >
            {children}
          </BlockToggle>
        );
      }

      return (
        <BlockHeading block={block} recordMap={recordMap!}>
          {children}
        </BlockHeading>
      );

    case "image":
      return (
        <BlockImage block={block} recordMap={recordMap!}>
          {children}
        </BlockImage>
      );

    case "bulleted_list":
    case "numbered_list": {
      return (
        <BlockList block={block} recordMap={recordMap!}>
          {children}
        </BlockList>
      );
    }

    case "equation":
      // For now, render as a simple math block
      return <BlockEquation block={block} />;

    case "to_do":
      return (
        <BlockTodo block={block} className={className}>
          {children}
        </BlockTodo>
      );

    case "quote":
      return (
        <BlockQuote block={block} className={className}>
          {children}
        </BlockQuote>
      );

    case "table":
      return (
        <div className={`${className} my-4 overflow-auto`}>
          <BlockTable block={block} recordMap={recordMap!} />
        </div>
      );

    case "table_row":
      return (
        <tr className="border-b border-gray-300 dark:border-gray-600">
          {children}
        </tr>
      );

    case "column_list":
      return (
        <BlockColumnList block={block} className={className}>
          {children}
        </BlockColumnList>
      );

    case "bookmark":
      return <BlockBookmark block={block} recordMap={recordMap!} />;

    case "embed":
    case "replit":
      return <BlockEmbed block={block} recordMap={recordMap!} />;

    case "video":
      return <BlockVideo block={block} recordMap={recordMap!} />;
    case "file":
      return (
        <BlockFile block={block} recordMap={recordMap!} className={className} />
      );

    case "column":
      return (
        <BlockColumn block={block} className={className}>
          {children}
        </BlockColumn>
      );

    case "divider":
      return <BlockDivider block={block} recordMap={recordMap!} />;

    case "collection_view_page":
    case "transclusion_reference":
      // Skip these for now - they're complex
      return null;

    case "page":
      // Handle page blocks if needed
      return <div className={className}>{children}</div>;

    default:
      // For unsupported blocks, show debug info in development
      if (process.env.NODE_ENV !== "production") {
        console.warn("Unsupported block type:", block.type);
      }

      return (
        <div className={className}>
          {process.env.NODE_ENV !== "production" && (
            <div className="text-gray-500 text-sm">
              Unsupported block type: {block.type}
            </div>
          )}
          {children}
        </div>
      );
  }
};
