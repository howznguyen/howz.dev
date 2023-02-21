import { getServerSideSitemap } from 'next-sitemap'
import { GetServerSideProps } from 'next'
import { Notion } from '@/lib';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    let posts = await Notion.getPosts();
    let urlDefault = "https://howz.dev";

    const fields = posts.map(post => {
        let url = `${urlDefault}/post/${post.slug}`;
        return {
            loc: url,
            lastmod: post.published.start
        }
    });

  return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default function Sitemap() {}