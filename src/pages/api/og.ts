import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import nodeHtmlToImage from 'node-html-to-image';

export default async function handler (req: NextApiRequest, res: NextApiResponse)  {
    let title = req.query.title
    let desc = req.query.desc

    let html = 
    `<!DOCTYPE html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
        <style>
            .og {
                width: 800px;
                max-width: 800px;
                height: 400px;
                font-family: 'Inter', sans-serif;
                background-image: url(http://localhost:3000/assets/images/grain-gradient.png);
                background-size: fill;
            }
    
            .title {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2; /* number of lines to show */
                        line-clamp: 2; 
                -webkit-box-orient: vertical;
            }
    
            .description {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1; /* number of lines to show */
                        line-clamp: 1; 
                -webkit-box-orient: vertical;
            }
        
        </style>
    </head>
    <body>
        <div class="og px-8 pt-16 pb-20 relative">
            <div class="flex flex-col justify-between h-full">
                <div class="text-4xl font-bold text-white">
                    <img src="{{avatar}}" alt="avatar" class="w-16 h-16 rounded-full">
                </div>
                
                <div class="flex flex-col justify-end h-full">
                    <h1 class="text-3xl font-bold text-white title">
                        {{title}}
                    </h1>
                    <p class="mt-2 text-xl text-slate-400 description">
                        {{desc}}
                    </p>
                </div>
    
            </div>
        </div>
    </body>
    </html>`;

    let image = await nodeHtmlToImage({
        puppeteerArgs: {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
        html: html,
        content: {
            avatar: 'https://avatars.githubusercontent.com/u/54036529?v=4',
            title: title,
            desc: desc,
        }
    });

    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': image.length
    });

    res.end(image);
}