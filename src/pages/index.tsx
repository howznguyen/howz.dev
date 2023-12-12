import { Button } from "@/components/atoms";
import { IntroCard, PostList } from "@/components/molecules";
import { MainTemplate } from "@/components/templates";
import { Notion, Route, getTransServer, useTrans } from "@/lib";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useEffect } from "react";

interface HomePageProps {
  featuredPosts: any[];
  categoriesPosts: any[];
  head: any;
  options: any;
}

const HomePage = ({
  featuredPosts,
  categoriesPosts,
  head,
  options,
}: HomePageProps) => {
  const trans = useTrans()
  
  useEffect(() => {
    localStorage.setItem("locale", trans.locale);
  }, [trans]);

  return (
    <>
      <MainTemplate head={head} options={options}>
        <div className="layout mt-2">
          <section className="fade-in-start">
            <IntroCard />
          </section>

          <section className="pb-5 md:pb-10 fade-in-start">
            <div data-fade="0" id="featured-post" className="scroll-mt-[70px]">
              <span className="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">
                { trans.home.featured_posts }
              </span>
              <PostList posts={featuredPosts} limit={6} className="mt-3" />
              <Button className="mt-4 scale-100 hover:scale-[1.1] active:scale-[0.97] motion-safe:transform-gpu transition duration-100">
                <Link href={Route.blog()}>{ trans.home.read_more }</Link>
              </Button>
            </div>
          </section>

          {categoriesPosts.map((category, index) => (
            <section key={index} className="py-5 md:py-10 fade-in-start">
              <div data-fade="0">
                <span className="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">
                  {category.name}
                </span>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {category.description}
                </p>
                <PostList posts={category.posts} limit={6} className="mt-3" />
              </div>
            </section>
          ))}
        </div>
      </MainTemplate>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const trans = getTransServer(context.locale);
  let posts = await Notion.getPosts({
    filter: {
      language: {
        select: { equals: context.locale }
      } 
    }
  });
  let options = await Notion.getNotionOptions();

  let featuredPosts = [...posts].sort((a, b) => {
    if (a.featured === b.featured) {
      return b.views - a.views;
    } else {
      return a.featured && !b.featured ? -1 : 1;
    }
  });

  let categories: any = trans.home.categories;

  let categoriesPosts = categories.map((c: any) => {
    c.posts = [...posts].filter((x) =>
      Array.isArray(c.value)
        ? x.tags.some((y: any) => c.value.includes(y))
        : x.tags.includes(c.value)
      && context.locale === c.language
    );
    return c;
  });

  let head = {
    url: Route.index(true),
  }

  return {
    props: {
      featuredPosts,
      categoriesPosts,
      head,
      options,
    },
    revalidate: 10,
  };
};

export default HomePage;
