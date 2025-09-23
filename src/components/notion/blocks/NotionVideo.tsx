"use client";

import ReactPlayer from "react-player/lazy";

interface NotionVideoProps {
  url: string;
}

export const NotionVideo = ({ url }: NotionVideoProps) => {
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
