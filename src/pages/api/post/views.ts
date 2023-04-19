import { Notion } from '@/lib'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (req: NextApiRequest, res: NextApiResponse)  {
    if (req.method !== 'POST') {
        res.status(405).json({message: 'Method Not Allowed'})
        return
    }
        
    let slug = req.query.slug
    let language = req.query.language

    if (slug && language) {
        let response = Notion.updateViewsBySlug(slug as string, language as string);
        res.status(200).json({message: 'Successful'});
    } else {
        res.status(404).json({message: 'Not Found'})
    }
}