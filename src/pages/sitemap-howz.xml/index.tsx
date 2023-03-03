import { getServerSideSitemap } from 'next-sitemap'
import { GetServerSideProps } from 'next'
import { Notion, Route } from '@/lib';
import moment from 'moment';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    let posts = await Notion.getPosts();
    let tags = await Notion.getTags();

    let fieldsPosts = posts.map(post => ({
        loc: Route.post(post.slug, true),
        lastmod: post.published.start
    }));

    let fieldTags = tags.map((tag: any) => ({
        loc: Route.tag.get(tag, true),
        lastmod: moment(),
    }));

    const fields = [...fieldsPosts, ...fieldTags];

  return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default function Sitemap() {}