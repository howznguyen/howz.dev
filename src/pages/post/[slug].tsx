import { CommentSection, TableOfContents, NotionRender } from "@/components/molecules"
import { MainTemplate } from "@/components/templates";
import { Notion } from "@/lib";
import moment from "moment";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import { HiEye, HiOutlineClock } from "react-icons/hi";

interface PostPageProps {
  post: any;
  settings: any;
  navigation: any;
}

const PostPage = ({ post, settings, navigation }: PostPageProps) => {
  if (!post) return <div>Loading...</div>;

  let head = {
    title: post.title,
    description: post.description,
  }

  return (
    <>
      <MainTemplate head={head} settings={settings} navigation={navigation}>
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
              Written on {moment(post.published.start).format("MMMM DD, YYYY")} by{" "}
              {post.authors[0].name}.
            </p>
            <div className="mt-6 flex items-center justify-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <HiOutlineClock />
                <span>{post.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <HiEye />
                <span>{50} views</span>
              </div>
            </div>
          </div>

          <hr className="dark:border-gray-600" />

          <div className="lg:grid lg:grid-cols-[auto,250px] lg:gap-4 mt-4">
            <section className="md:mr-6 leading-7 text-justify w-auto">
              <NotionRender contents={post.contents} />
            </section>

            <div className="relative">
              <TableOfContents data={post.contents} />
            </div>

            <CommentSection />
          </div>
        </main>
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
  let settings = await Notion.getSettings();
  let post = await Notion.getPostBySlug(slug as string);
  let navigation = await Notion.getNavigation();

  return {
    props: {
      post: post,
      settings: settings,
      navigation: navigation,
    },
    revalidate: 60,
  };
};

export default PostPage;
