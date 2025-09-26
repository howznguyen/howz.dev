"use client";

import React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";
import Zoom from "react-medium-image-zoom";
import Image from "next/image";
import { Image as ImageHelper } from "@/lib";

interface NotionImageProps {
  block: Block;
  recordMap?: ExtendedRecordMap;
  src?: string;
  alt?: string;
  caption?: React.ReactNode;
  children?: React.ReactNode;
}

export const NotionImage: React.FC<NotionImageProps> = ({
  block,
  recordMap,
  src: propSrc,
  alt: propAlt,
  caption: propCaption,
  children
}) => {
  // Extract image data from block or use provided props
  const src = propSrc ||
    block.properties?.source?.[0]?.[0] ||
    block.format?.display_source ||
    block.properties?.file?.[0]?.[0] || "";

  const alt = propAlt ||
    block.properties?.caption?.[0]?.[0] ||
    "Image";

  const caption = propCaption ||
    block.properties?.caption?.[0]?.[0];

  if (!src) return null;
  return (
    <div className="flex justify-center mb-4">
      <figure className="w-auto flex flex-col justify-center">
        <Zoom>
          <Image
            src={src}
            alt={alt}
            className="w-auto h-auto rounded-lg"
            width={1600}
            height={1200}
            loading="lazy"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${ImageHelper.generaterImagePlaceholder()}`}
          />
        </Zoom>
        <figcaption className="mt-2 text-md italic font-semibold text-center text-gray-500 dark:text-gray-400-400">
          {caption}
        </figcaption>
      </figure>
    </div>
  );
};