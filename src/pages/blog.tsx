import { PostList } from "@/components/molecules";
import { MainTemplate } from "@/components/templates";
import { Notion, Route, useTrans } from "@/lib";
import { GetStaticProps } from "next";
import removeAccents from "remove-accents";
import { useEffect, useState } from "react";

interface BlogPageProps {
  posts: any[];
  head: any;
  options: any;
}

const BlogPage = ({ posts, head, options }: BlogPageProps) => {
  const trans = useTrans();
  let [statePosts, setStatePosts] = useState(posts);

  useEffect(() => {
    if(statePosts !== posts) {
      setStatePosts(posts);
    }
  }, [statePosts, posts])

  const findPosts = (e: any) => {
    let filteredPosts = statePosts.filter((post: any) => {
      return removeAccents(post.title.toLowerCase()).includes(
        removeAccents(e.target.value.toLowerCase())
      );
    });
    setStatePosts(filteredPosts);
  };

  return (
    <>
      <MainTemplate options={options} head={head}>
        <div className="layout py-12">
          <h1 className="text-3xl md:text-5xl font-semibold">{ trans.blog.blog }</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            { trans.blog.intro }
          </p>
          <div className="mt-2 flex items-center justify-center w-full">
            <input
              type="text"
              className="w-full max-w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              placeholder={ trans.blog.find_posts }
              onChange={findPosts}
            />
          </div>

          <div className="mt-4">
            {/* Sort to Date */}

            <PostList posts={statePosts} />
            {statePosts.length === 0 && (
              <h2 className="mt-8 text-center text-2xl dark:text-white font-bold">
                { trans.blog.not_found_post }
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
  // {
  //   filter: {
  //     language: {
  //       select: { equals: context.locale }
  //     } 
  //   }
  // }
  let options = await Notion.getNotionOptions();

  let head = {
    url: Route.blog(true),
    title: "Blog",
    description: "Blog",
  };

  posts = posts.filter((x) => context.locale === x.language);

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
