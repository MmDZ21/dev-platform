import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const SITE_URL = process.env.SITE_URL

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 50, // Limit for performance, increase if you want
    select: { title: true, slug: true, metaDescription: true, content: true, createdAt: true, updatedAt: true },
  });

  const items = posts.map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid>${SITE_URL}/posts/${post.slug}</guid>
      <description><![CDATA[${post.metaDescription || ""}]]></description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <lastBuildDate>${new Date(post.updatedAt).toUTCString()}</lastBuildDate>
      <content:encoded><![CDATA[${post.content || ""}]]></content:encoded>
    </item>
  `).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
      <title>dev-platform.ir</title>
      <link>${SITE_URL}</link>
      <description>Your latest blog posts</description>
      <language>fa</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
}
