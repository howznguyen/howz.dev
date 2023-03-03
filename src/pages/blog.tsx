import { PostList } from "@/components/molecules";
import { MainTemplate } from "@/components/templates";
import { HeadMeta, Notion, Route } from "@/lib";
import { GetStaticProps } from "next";
import removeAccents from "remove-accents";
import React from "react";

interface BlogPageProps {
  posts: any[];
  head: any;
  options: any;
}

const BlogPage = ({ posts, head, options }: BlogPageProps) => {
  let [filterPosts, setFilterPosts] = React.useState(posts);

  const findPosts = (e: any) => {
    let filteredPosts = posts.filter((post: any) => {
      console.log(removeAccents(post.title.toLowerCase()), removeAccents(e.target.value.toLowerCase()))
      return removeAccents(post.title.toLowerCase()).includes(
        removeAccents(e.target.value.toLowerCase())
      );
    });
    setFilterPosts(filteredPosts);
  };

  return (
    <>
      <MainTemplate options={options} head={head}>
        <div className="layout py-12">
          <h1 className="text-3xl md:text-5xl font-semibold">Blog</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Ở đây bạn có thể tìm thấy tất cả các bài viết của mình
          </p>
          <div className="mt-2 flex items-center justify-center w-full">
            <input
              type="text"
              className="w-full max-w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Tìm kiếm bài viết..."
              onChange={findPosts}
            />
          </div>

          <div className="mt-4">
            {/* Sort to Date */}

            <PostList posts={filterPosts} />
            {filterPosts.length === 0 && (
              <h2 className="mt-8 text-center text-2xl dark:text-white font-bold">
                {"Không tìm thấy :<"}
              </h2>
            )}
          </div>
        </div>
      </MainTemplate>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  let posts = await Notion.getPosts();
  let options = await Notion.getNotionOptions();

  let head = {
    url: Route.blog(true),
    title: "Blog",
    description: "Blog",
  };

  return {
    props: {
      posts: posts,
      options: options,
      head: head,
    },
    revalidate: 10,
  };
};

export default BlogPage;
