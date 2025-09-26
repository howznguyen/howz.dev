"use client";

import React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";
import Icon from "@/components/atoms/Icon";
import { NotionRichText } from "./NotionRichText";
import cn from "classnames";
import { createSlugFromTitleAndUuid } from "@/lib/helpers";

interface NotionHeadingProps {
  block: Block;
  recordMap: ExtendedRecordMap;
  children?: React.ReactNode;
  isChild?: boolean;
}

export const NotionHeading: React.FC<NotionHeadingProps> = ({
  block,
  recordMap,
  children,
  isChild = false,
}) => {
  const sizes = {
    header: "text-3xl scroll-mt-[80px]",
    sub_header: "text-2xl scroll-mt-[60px]",
    sub_sub_header: "text-xl scroll-mt-[50px]",
  };

  const margins = {
    header: "mt-8",
    sub_header: "mt-6",
    sub_sub_header: "mt-4",
  };

  const tagName = {
    header: "h1",
    sub_header: "h2",
    sub_sub_header: "h3",
  };

  const blockType = block.type as "header" | "sub_header" | "sub_sub_header";
  const size = sizes[blockType] || sizes.header;
  const margin = isChild ? "" : margins[blockType] || margins.header;
  const HeadingComponent = tagName[blockType] as keyof JSX.IntrinsicElements;
  const title =
    block.properties?.title && block.properties.title.length > 0
      ? block.properties.title.reduce(
          (acc: string, curr: any) => acc + curr[0],
          ""
        )
      : "";

  const slug = createSlugFromTitleAndUuid(title, block.id);

  return (
    <HeadingComponent
      className={cn(
        size,
        margin,
        "font-semibold dark:text-white my-2 flex items-center gap-2 group"
      )}
      id={slug}
    >
      {block.properties?.title && (
        <NotionRichText value={block.properties.title} block={block} />
      )}
      <a
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        )}
        href={`#${slug}`}
        title={typeof children === "string" ? children : "Link to heading"}
      >
        <Icon icon="CiLink" />
      </a>
    </HeadingComponent>
  );
};
