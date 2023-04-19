import { PostList } from '@/components/molecules';
import { MainTemplate } from '@/components/templates'
import { Notion, Route, useTrans } from '@/lib'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useEffect, useState } from 'react';

interface TagPageProps {
  tag: any,
  posts: any,
  head: any;
  options: any;
}

const TagPage = ({tag, posts, head, options} : TagPageProps) => {
  const trans = useTrans();
  let [statePosts, setStatePosts] = useState(posts ?? []);

  useEffect(() => {
    if(statePosts !== posts) {
      setStatePosts(posts ?? []);
    }
  }, [statePosts, posts]);

  return (
    <MainTemplate options={options} head={head}>
        <div className="layout py-12">
          <h1 className="text-3xl md:text-5xl font-semibold">{trans.tag.tag} #{tag}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {trans.tag.post_by_tag}
          </p>

          <div className="mt-4">
            {statePosts.length > 0 && (<PostList posts={statePosts} />)}
            {statePosts.length === 0 && (
              <h2 className="mt-8 text-center text-2xl dark:text-white font-bold">
                {trans.tag.not_found_post}
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

    posts = posts.filter((x) => context.locale === x.language);

    let head = {
      url: Route.tag.index(true),
      title: `Tags #${tag}`, 
      description: `Những bài viết thuộc tag #${tag}`,
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