import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

interface CommentSectionProps {}

const CommentSection = ({}: CommentSectionProps) => {
  let { theme } = useTheme();

  return (
    <div className="md:col-span-2 flex content-center">
      <Giscus
        id="comments"
        repo="howz-dev/howz-dev"
        repoId="R_kgDOI7ylrw"
        category="Post"
        categoryId="DIC_kwDOI7ylr84CUGGn"
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === "dark" ? "dark" : "light"}
        host="https://giscus.app"
        lang="vi"
      />
    </div>
  );
};

export default CommentSection;
