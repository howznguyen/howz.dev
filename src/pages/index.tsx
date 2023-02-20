import { Button } from '@/components/atoms';
import { IntroCard, PostList } from '@/components/molecules';
import { MainTemplate } from '@/components/templates';
import { Notion, Route } from '@/lib';
import { GetStaticProps } from 'next';
import Link from 'next/link';

interface HomePageProps {
  featuredPosts: any[];
  categoriesPosts: any[];
  // posts: any[];
  options: any;
}

const HomePage = ({featuredPosts,categoriesPosts, options}: HomePageProps) => {
  return (
    <MainTemplate options={options}>
        <div className="layout mt-2">
          
          <section className="fade-in-start">
            <IntroCard />
          </section>

          <section className="pb-20 fade-in-start">
            <div data-fade="0" id="featured-post" className="scroll-mt-[70px]">
              <h2 className="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">Featured Posts</h2>
              <PostList posts={featuredPosts} limit={6} className="mt-3" />
              <Button className="mt-4 scale-100 hover:scale-[1.1] active:scale-[0.97] motion-safe:transform-gpu transition duration-100">
                  <Link href={Route.blog()}>See more post</Link>
              </Button>
            </div>
          </section>

          {categoriesPosts.map((category, index) => (
            <section key={index} className="py-20 fade-in-start">
              <div data-fade="0">
                <h2 className="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">{category.name}</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{category.description}</p>
                <PostList posts={category.posts} limit={6} className="mt-3" />
                <Button className="mt-4 scale-100 hover:scale-[1.1] active:scale-[0.97] motion-safe:transform-gpu transition duration-100">
                  <Link href="#">See more post</Link>
                </Button>
              </div>
            </section>
          ))}
        </div>
    </MainTemplate>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  let posts = await Notion.getPosts();
  let options = await Notion.getNotionOptions();

  let featuredPosts = [...posts].sort((a, b) => {
    if( a.featured === b.featured ) {
      return b.views - a.views;
    } else {
      return a.featured && !b.featured ? -1 : 1;
    }
  });

  let categories: any = JSON.parse(options.settings.categories || '[]');

  let categoriesPosts = categories.map((c: any) => {
    c.posts = [...posts].filter(x => x.tags.includes(c.value));
    return c;
  })

  return {
      props: {
          featuredPosts,
          categoriesPosts,
          // posts,
          options,
      },
      revalidate: 10,
  }
}

export default HomePage
