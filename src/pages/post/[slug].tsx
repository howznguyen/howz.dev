import { CommentSection, TableOfContents, NotionRender, PostList } from "@/components/molecules"
import { MainTemplate, PageNotFound } from "@/components/templates";
import { HeadMeta, Notion } from "@/lib";
import moment from "moment";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import React, { useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import { HiEye, HiOutlineClock } from "react-icons/hi";
import {
  GISCUS_REPO,
  GISCUS_REPO_ID,
  GISCUS_CATEGORY,
  GISCUS_CATEGORY_ID,
} from "@/lib/env";
import { useRouter } from "next/router";
import { Loading } from "@/components/organisms";
import { NextSeo } from "next-seo";
import Head from "next/head";

interface PostPageProps {
  slug: any;
  post: any;
  relatedPosts: any;
  head: any;
  options: any;
  giscus: any;
}

const PostPage = ({ slug, post, relatedPosts, head, giscus, options }: PostPageProps) => {
  const router = useRouter()
  useEffect(() => {
    fetch(`/api/update-views?slug=${slug}`,{method:'POST'});
  }, [slug]);

  if (!post ) return <PageNotFound/>


  return (
    <>
      <NextSeo 
        title={head.siteTitle}
        description={head.siteDescription}
        canonical="https://howz.dev"
        openGraph={{
          title: head.siteTitle,
          description: head.siteDescription,
          images: [
            {
              url: head.ogImage,
              width: 800,
              height: 400,
              alt: head.siteTitle,
            },
          ],
        }}
      />
      <Head>
        <title>{head.siteTitle}</title>
      </Head>

      <MainTemplate options={options}>
        {router.isFallback && <Loading />}
        {post &&
        <main className="layout">
        <div className="pb-4 dark:border-gray-600">
          <Zoom>
            <div className="relative w-full aspect-[5/2] rounded-lg overflow-hidden">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </Zoom>

          <h1 className="mt-4 text-xl font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl dark:text-white">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Viết vào {moment(post.published.start).format("MMMM DD, YYYY")} bởi{" "}{post.authors[0].name}.
          </p>
          <div className="mt-6 flex items-center justify-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <HiOutlineClock />
              <span>{post.readingTime} phút đọc</span>
            </div>
            <div className="flex items-center gap-1">
              <HiEye />
              <span>{post.views} lượt xem</span>
            </div>
          </div>
        </div>

        <hr className="dark:border-gray-600" />

        <div className="lg:grid lg:grid-cols-[auto,250px] lg:gap-4 mt-4">
          <section className="md:mr-6 leading-7 text-justify w-auto">
            <NotionRender contents={post.contents} />

            <span>
              Tags: {post.tags.map((tag: any, index: number) => (
              <button key={index} className="bg-opacity-80 dark:!bg-opacity-60 inline-block rounded-md px-1.5 py-0.5 font-medium transition-colors bg-gray-100 text-gray-700 hover:text-black disabled:text-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:text-white dark:disabled:bg-gray-600 focus:outline-none mr-2" tabIndex={-1}>
                {tag}
              </button>
            ))}
            </span>
          </section>

          <div className="relative">
            <TableOfContents data={post.contents} />
          </div>

          <div className="md:col-span-2">
              <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
                Những Bài Viết Liên Quan:
              </h3>
              <PostList posts={relatedPosts} limit={3} />
          </div>

          <CommentSection giscus={giscus} />
        </div>
        </main>}
      </MainTemplate>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  let posts = await Notion.getPosts();

  let paths = posts.map((post: any) => ({
    params: {
      slug: post.slug,
    },
  }));

  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  let slug = context.params?.slug;
  let options = await Notion.getNotionOptions();
  let post = null;
  let posts = await Notion.getPosts();
  let relatedPosts = [];
  try {
    post = await Notion.getPostBySlug(slug as string);
  } catch (error) { }
  

  let giscus = {
    GISCUS_REPO,
    GISCUS_REPO_ID,
    GISCUS_CATEGORY,
    GISCUS_CATEGORY_ID,
  }

  let headData = {
    title: post?.title,
    description: post?.description,
    image: post?.cover,
  };

  let head = HeadMeta(options, headData);

  if(post) {
    let tags = post.tags;
    relatedPosts = [...posts].filter((x) => x.tags.some((y : any) => tags.includes(y))).map(value => ({ value, sort: Math.random() }))
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
