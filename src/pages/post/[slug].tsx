import {
  CommentSection,
  TableOfContents,
  NotionRender,
  PostList,
} from "@/components/molecules";
import { MainTemplate, PageNotFound } from "@/components/templates";
import { Notion, Route, Image as ImageHelper, useTrans } from "@/lib";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import {
  GISCUS_REPO,
  GISCUS_REPO_ID,
  GISCUS_CATEGORY,
  GISCUS_CATEGORY_ID,
} from "@/lib/env";
import { useRouter } from "next/router";
import { LoadingSection } from "@/components/organisms";
import { Icon, Tag } from "@/components/atoms";

interface PostPageProps {
  slug: any;
  post: any;
  relatedPosts: any;
  head: any;
  options: any;
  giscus: any;
}

const PostPage = ({
  slug,
  post,
  relatedPosts,
  head,
  giscus,
  options,
}: PostPageProps) => {
  const router = useRouter();
  const trans = useTrans();
  let [stateRelatedPosts, setStateRelatedPosts] = useState(relatedPosts);
  let locale = router.locale ?? 'vi';

  useEffect(() => {
    fetch(Route.api.post.updateViews(slug, locale), { method: "POST" });
    if(stateRelatedPosts !== relatedPosts) {
      setStateRelatedPosts(relatedPosts);
    }
  }, [slug,locale, stateRelatedPosts, relatedPosts]);

  if (!post) return <PageNotFound />;

  return (
    <MainTemplate head={head} options={options}>
      {router.isFallback && <LoadingSection />}
      {post && (
        <main className="layout">
          <div className="pb-4 dark:border-gray-600">
            <Zoom>
              <div className="relative w-full aspect-[5/2] rounded-lg overflow-hidden">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 50vw,
                         (max-width: 1200px) 50vw,
                          100vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${ImageHelper.generaterImagePlaceholder()}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </Zoom>

            <h1 className="mt-4 text-xl font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl dark:text-white">
              {post.title}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {trans.post.published_at_by(post.published.start, post.authors[0].name, locale)}
            </p>
            <div className="mt-6 flex items-center justify-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <Icon icon="HiOutlineClock"/>
                <span>{trans.post.reading_time(post.readingTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="HiEye"/>
                <span>{trans.post.reading_time(post.views)}</span>
              </div>
            </div>
          </div>

          <hr className="dark:border-gray-600" />

          <div className="lg:grid lg:grid-cols-[auto,250px] lg:gap-4 mt-4">
            <section className="md:mr-6 leading-7 text-justify w-auto">
              <NotionRender contents={post.contents} />

              <span>
                {trans.tag.tags}:{" "}
                {post.tags.map((tag: any, index: number) => (
                  <Tag key={index} name={tag} />
                ))}
              </span>
            </section>

            <div className="relative">
              <TableOfContents data={post.contents} />
            </div>

            <div className="md:col-span-2 mb-2">
              <span className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
                {trans.post.relate_post}
              </span>
              <PostList posts={stateRelatedPosts} limit={3} />
            </div>

            <CommentSection giscus={giscus} />
          </div>
        </main>
      )}
    </MainTemplate>
  );
};

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  let posts = await Notion.getPosts();

  let paths = posts.map((post: any) => ({
    params: {
      slug: post.slug,
    },
    locale: post.language
  }));

  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  let slug = context.params?.slug;
  let locale = context.locale;
  let options = await Notion.getNotionOptions();
  let post: any = null;
  let posts = await Notion.getPosts();
  let relatedPosts = [];
  try {
    post = await Notion.getPostBySlug(slug as string, locale as string);
  } catch (error) {}

  let giscus = {
    GISCUS_REPO,
    GISCUS_REPO_ID,
    GISCUS_CATEGORY,
    GISCUS_CATEGORY_ID,
  };

  let head = {
    url: Route.post(slug as string, true),
    title: post?.title,
    description: post?.description,
    image: post?.cover,
  };

  if (post) {
    if (post.language !== locale) {
      return {
        notFound: true,
      }
    }
    let tags = post.tags;
    relatedPosts = [...posts]
      .filter((x) => x.tags.some((y: any) => tags.includes(y)) && x.id !== post.id && context.locale === x.language)
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  return {
    props: {
      post: post,
      relatedPosts: relatedPosts,
      options: options,
      giscus: giscus,
      head: head,
      slug: slug,
    },
    revalidate: 10,
  };
};

export default PostPage;
