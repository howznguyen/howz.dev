import { Button } from "@/components/atoms";
import { IntroCard, PostList } from "@/components/molecules";
import { MainTemplate } from "@/components/templates";
import { HeadMeta, Notion, Route } from "@/lib";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo"
import Head from "next/head";
import Link from "next/link";

interface HomePageProps {
  featuredPosts: any[];
  categoriesPosts: any[];
  head: any;
  // posts: any[];
  options: any;
}

const HomePage = ({
  featuredPosts,
  categoriesPosts,
  head,
  options,
}: HomePageProps) => {
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
        <div className="layout mt-2">
          <section className="fade-in-start">
            <IntroCard />
          </section>

          <section className="pb-20 fade-in-start">
            <div data-fade="0" id="featured-post" className="scroll-mt-[70px]">
              <h2 className="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">
                Bài Viết Đặt Sắc
              </h2>
              <PostList posts={featuredPosts} limit={6} className="mt-3" />
              <Button className="mt-4 scale-100 hover:scale-[1.1] active:scale-[0.97] motion-safe:transform-gpu transition duration-100">
                <Link href={Route.blog()}>Xem thêm</Link>
              </Button>
            </div>
          </section>

          {categoriesPosts.map((category, index) => (
            <section key={index} className="py-20 fade-in-start">
              <div data-fade="0">
                <h2 className="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">
                  {category.name}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {category.description}
                </p>
                <PostList posts={category.posts} limit={6} className="mt-3" />
                <Button className="mt-4 scale-100 hover:scale-[1.1] active:scale-[0.97] motion-safe:transform-gpu transition duration-100">
                  <Link href="#">Xem thêm</Link>
                </Button>
              </div>
            </section>
          ))}
        </div>
      </MainTemplate>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  let posts = await Notion.getPosts();
  let options = await Notion.getNotionOptions();

  let featuredPosts = [...posts].sort((a, b) => {
    if (a.featured === b.featured) {
      return b.views - a.views;
    } else {
      return a.featured && !b.featured ? -1 : 1;
    }
  });

  let categories: any = JSON.parse(options.settings.categories || "[]");

  let categoriesPosts = categories.map((c: any) => {
    c.posts = [...posts].filter((x) => (Array.isArray(c.value)) ? x.tags.some((y : any) => c.value.includes(y)) : x.tags.includes(c.value));
    return c;
  });

  let head = HeadMeta(options, {});

  return {
    props: {
      featuredPosts,
      categoriesPosts,
      head,
      // posts,
      options,
    },
    revalidate: 10,
  };
};

export default HomePage;
