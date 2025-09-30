"use client";

import React, { useState, useEffect } from "react";
import type { Block, ExtendedRecordMap } from "notion-types";
import ReactPlayer from "react-player/lazy";

interface BlockVideoProps {
  block: Block;
  recordMap: ExtendedRecordMap;
  url?: string;
}

export const BlockVideo: React.FC<BlockVideoProps> = ({
  block,
  recordMap,
  url: propUrl,
}) => {
  const [isClient, setIsClient] = useState(false);
  const url = propUrl || block.properties?.source?.[0]?.[0] || "";

  // Only render ReactPlayer on client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!url) return null;
  const link = new URL(url);
  const aspests = {
    youtube: "aspect-[16/9]",
    vimeo: "aspect-[16/9]",
    dailymotion: "aspect-[16/9]",
    twitch: "aspect-[16/9]",
  };
  const aspect =
    Object.entries(aspests).find(([key, value]: any) =>
      link.hostname.includes(key),
    )?.[1] ?? "";

  return (
    <div className={`mb-4 w-full flex justify-center ${aspect}`}>
      {isClient ? (
        <ReactPlayer
          controls={true}
          url={url}
          width="100%"
          height="100%"
          pip={true}
          config={{
            youtube: {
              playerVars: { showinfo: 1 },
            },
          }}
        />
      ) : (
        // Placeholder for SSR - matches the dimensions
        <div
          className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-lg"
          style={{ width: "100%", height: "100%" }}
        >
          <div className="text-gray-500 dark:text-gray-400">
            Loading video...
          </div>
        </div>
      )}
    </div>
  );
};
