"use client";

import React from "react";
import type { Block as BlockType } from "notion-types";
import { BlockToggle } from "./BlockToggle";
import { NotionRichText } from "./NotionRichText";
import { NotionCallout } from "./NotionCallout";
import { NotionCode } from "./NotionCode";
import { NotionParagraph } from "./NotionParagraph";
import { NotionHeading } from "./NotionHeading";
import { NotionImage } from "./NotionImage";
import { NotionList } from "./NotionList";
import { NotionTodo } from "./NotionTodo";
import { NotionQuote } from "./NotionQuote";
import { NotionColumn, NotionColumnList } from "./NotionColumn";
import { NotionText } from "./NotionText";
import { useNotionContext } from "../NotionContext";
import BlockEquation from "./BlockEquation";
import cn from "classnames";
import { NotionDivider } from "./NotionDivider";
import { NotionEmbed } from "./NotionEmbed";
import { NotionVideo } from "./NotionVideo";
import { NotionBookmark } from "./NotionBookmark";

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
  const { recordMap } = useNotionContext();

  // Switch case to handle different block types
  switch (block.type) {
    case "toggle":
      console.log("Toggle block:", block);
      return (
        <BlockToggle
          className={className}
          text={
            block.properties?.title ? (
              <NotionRichText value={block.properties.title} block={block} />
            ) : (
              "Toggle"
            )
          }
          color={block.format?.block_color}
        >
          {children}
        </BlockToggle>
      );

    case "callout":
      return (
        <NotionCallout block={block} className={className}>
          {children}
        </NotionCallout>
      );

    case "code":
      return (
        <NotionCode block={block} recordMap={recordMap!}>
          {children}
        </NotionCode>
      );

    case "text":
      return (
        <NotionText block={block} className={className}>
          {children}
        </NotionText>
      );

    case "header":
    case "sub_header":
    case "sub_sub_header":
      // Check if heading is toggleable (Toggle + Heading combination)
      if (block.format?.toggleable) {
        return (
          <BlockToggle
            className={className}
            text={
              <NotionHeading
                block={block}
                recordMap={recordMap!}
                isChild={true}
              >
                {children}
              </NotionHeading>
            }
            color={block.format?.block_color}
          >
            {children}
          </BlockToggle>
        );
      }

      return (
        <NotionHeading block={block} recordMap={recordMap!}>
          {children}
        </NotionHeading>
      );

    case "text": {
      if (!block.properties && !block.content?.length) {
        return <div className={cn("notion-blank", block.id)}>&nbsp;</div>;
      }
      const blockColor = block.format?.block_color;
      const classNameStr = cn(
        "notion-text",
        block.id,
        blockColor && `notion-${blockColor}`,
        "abc"
      );
      return (
        <NotionText block={block} className={classNameStr}>
          {children}
        </NotionText>
      );
    }

    case "image":
      return (
        <NotionImage block={block} recordMap={recordMap!}>
          {children}
        </NotionImage>
      );

    case "bulleted_list":
    case "numbered_list": {
      return (
        <NotionList
          block={block}
          recordMap={recordMap!}
          ordered={block.type === "numbered_list"}
        >
          {children}
        </NotionList>
      );
    }

    case "equation":
      // For now, render as a simple math block
      return <BlockEquation block={block} />;

    case "to_do":
      return (
        <NotionTodo block={block} className={className}>
          {children}
        </NotionTodo>
      );

    case "quote":
      return (
        <NotionQuote block={block} className={className}>
          {children}
        </NotionQuote>
      );

    case "table":
      return (
        <div className={`${className} my-4 overflow-auto`}>
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
            <tbody>{children}</tbody>
          </table>
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
        <NotionColumnList block={block} className={className}>
          {children}
        </NotionColumnList>
      );

    case "bookmark":
      return <NotionBookmark block={block} recordMap={recordMap!} />;

    case "embed":
    case "replit":
      return <NotionEmbed block={block} recordMap={recordMap!} />;

    case "video":
      return <NotionVideo block={block} recordMap={recordMap!} />;

    case "file":
      return <div className={className}>{children}</div>;

    case "column":
      return (
        <NotionColumn block={block} className={className}>
          {children}
        </NotionColumn>
      );

    case "divider":
      return <NotionDivider block={block} recordMap={recordMap!} />;

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
