"use client";

import Zoom from "react-medium-image-zoom";
import Image from "next/image";
import { Image as ImageHelper } from "@/lib";
import { ReactNode } from "react";

interface NotionImageProps {
  src: string;
  alt: string;
  caption?: ReactNode;
}

export const NotionImage = ({ src, alt, caption }: NotionImageProps) => {
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