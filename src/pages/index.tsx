import { PostList } from '@/components/molecules';
import { MainTemplate } from '@/components/templates';
import { Notion } from '@/lib';
import { GetStaticProps } from 'next';

interface HomePageProps {
  posts: any[]
  options: any
}

const HomePage = ({posts, options}: HomePageProps) => {
  return (
    <MainTemplate options={options}>
        <div className="layout mt-2">
            <h2 className="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">Latest Posts</h2>
            <PostList posts={posts} />
        </div>
    </MainTemplate>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  let posts = await Notion.getPosts();
    let options = await Notion.getNotionOptions();

  return {
      props: {
          posts: posts,
          options: options
      },
      revalidate: 10,
  }
}

export default HomePage