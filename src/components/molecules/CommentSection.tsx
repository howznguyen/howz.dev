import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

interface CommentSectionProps {
  giscus : any;
}


const CommentSection = ({ giscus }: CommentSectionProps) => {
  const { locale } = useRouter()
  let { theme } = useTheme();

  return (
    <div className="md:col-span-2 flex content-center">
      <Giscus
        id="comments"
        repo={giscus.GISCUS_REPO}
        repoId={giscus.GISCUS_REPO_ID}
        category={giscus.GISCUS_CATEGORY}
        categoryId={giscus.GISCUS_CATEGORY_ID}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        loading="lazy"
        theme={theme === "dark" ? "dark" : "light"}
        host="https://giscus.app"
        lang={locale}
      />
    </div>
  );
};

export default CommentSection;
