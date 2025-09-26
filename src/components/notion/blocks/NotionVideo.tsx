"use client";

import React from "react";
import type { Block, ExtendedRecordMap } from "notion-types";
import ReactPlayer from "react-player/lazy";

interface NotionVideoProps {
  block: Block;
  recordMap: ExtendedRecordMap;
  url?: string;
}

export const NotionVideo: React.FC<NotionVideoProps> = ({ block, recordMap, url: propUrl }) => {
  const url = propUrl || block.properties?.source?.[0]?.[0] || "";

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
      link.hostname.includes(key)
    )?.[1] ?? "";

  return (
    <div className={`mb-4 w-full flex justify-center ${aspect}`}>
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
    </div>
  );
};
