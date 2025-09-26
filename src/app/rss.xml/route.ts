import { NextResponse } from "next/server";
import Notion from "@/services/notion";
import { Route } from "@/lib";

export async function GET() {
  try {
    // Get posts for RSS using enhanced service
    const posts = await Notion.getPostsForRSS();

    // Generate RSS XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Howz Nguyen Blog</title>
    <description>Personal website and blog made using Next.js, TypeScript, Tailwind CSS and Notion</description>
    <link>${Route.index(true)}</link>
    <language>vi</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${Route.index(
      true
    )}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map((post: any) => {
        const pubDate = post.date
          ? new Date(post.date).toUTCString()
          : new Date().toUTCString();
        const postUrl = `${Route.index(true)}${post.url}`;

        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new NextResponse("Error generating RSS feed", { status: 500 });
  }
}
