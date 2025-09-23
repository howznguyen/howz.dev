"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

interface CommentSectionProps {
  giscus: any;
  slug?: string;
}

const CommentSection = ({ giscus, slug }: CommentSectionProps) => {
  const pathname = usePathname();
  let { theme } = useTheme();

  // Generate the correct term for Giscus based on our URL structure
  const getGiscusTerm = () => {
    return `/post/${slug}`;
  };

  return (
    <div className="md:col-span-2 flex content-center">
      <Giscus
        id="comments"
        repo={giscus.GISCUS_REPO}
        repoId={giscus.GISCUS_REPO_ID}
        category={giscus.GISCUS_CATEGORY}
        categoryId={giscus.GISCUS_CATEGORY_ID}
        mapping="pathname"
        term={getGiscusTerm()}
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        loading="lazy"
        theme={theme === "dark" ? "dark" : "light"}
        host="https://giscus.app"
        lang="en"
      />
    </div>
  );
};

export default CommentSection;
