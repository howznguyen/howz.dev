import { Image ,Tag } from '@/components/atoms';
import { PostList } from '@/components/molecules';
import { MainTemplate } from '@/components/templates'
import { Notion, Route } from '@/lib'
import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'

interface TagPageProps {
  tag: any,
  posts: any,
  head: any;
  options: any;
}

const TagPage = ({tag, posts, head, options} : TagPageProps) => {
  posts = posts ?? [];

  return (
    <MainTemplate options={options} head={head}>
        <div className="layout py-12">
          <h1 className="text-3xl md:text-5xl font-semibold">Tags #{tag}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Các bài viết của tag:
          </p>

          <div className="mt-4">
            <PostList posts={posts} />
            {posts.length === 0 && (
              <h2 className="mt-8 text-center text-2xl dark:text-white font-bold">
                {"Không có bài viết nào"}
              </h2>
            )}
          </div>
        </div>
    </MainTemplate>
  )
 
}

export const getStaticPaths: GetStaticPaths = async () => {
  let tags = await Notion.getTags();

  let paths = tags.map((tag: any) => ({
    params: {
      tag: tag,
    },
  }));

  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
    let tag = context.params?.tag ?? '';
    let posts = await Notion.getPostsByTag(tag as string);
    let options = await Notion.getNotionOptions();

    let head = {
      url: Route.tag.index(true),
      title: "Tags",
      description: "Tags",
    };

    return {
      props: {
        tag: tag,
        posts: posts,
        head: head,
        options: options,
      },
      revalidate: 10,
    }
}

export default TagPage