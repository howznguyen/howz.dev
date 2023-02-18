import { Notion } from '@/lib'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (req: NextApiRequest, res: NextApiResponse)  {
    let query = req.query.q

    if (query) {
        let posts = await Notion.getPosts(
            {
                filter: {
                    title : {
                        rich_text: {
                            contains: query as string
                        },
                    }
                }
            }
        );
        res.status(200).json(posts);
    }else {
        res.status(404).json({message: 'Not Found'})
    }
}