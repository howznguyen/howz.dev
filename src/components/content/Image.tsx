import React from "react";
import Zoom from "react-medium-image-zoom";
import Image from "next/image";

interface ImageProps {
  src: string;
  alt: string;
  caption?: React.ReactNode;
}

const ImageBlock = ({ src, alt, caption }: ImageProps) => {
  return (
    <div className="flex justify-center mb-4">
      <Zoom>
        <figure className="w-auto flex flex-col justify-center">
          <Image
            src={src}
            alt={alt}
            className="w-auto h-auto rounded-lg"
            width={800}
            height={600}
            // unoptimized={true}
            loading="lazy"
          />

          <figcaption className="mt-2 text-md italic font-semibold text-center text-gray-500 dark:text-gray-400-400">
            {caption}
          </figcaption>
        </figure>
      </Zoom>
    </div>
  );
};

export default ImageBlock;
