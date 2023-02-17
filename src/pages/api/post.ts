import { Notion } from '@/lib'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (req: NextApiRequest, res: NextApiResponse)  {
    let slug = req.query.slug

    if (slug) {
        let page = await Notion.getPostBySlug(slug as string)
        res.status(200).json(page);
    }else {
        let posts = await Notion.getPosts();
        res.status(200).json(posts)
    }
}