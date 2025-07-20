import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";

// Size: 1200x630 is standard for OG
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Dynamic OG image for a blog post
export default async function OpengraphImage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    select: { title: true, metaTitle: true, imageUrl: true },
  });

  if (!post) {
    return new ImageResponse(
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e293b",
          color: "white",
          fontSize: 48,
          fontWeight: "bold",
        }}
      >
        Post Not Found
      </div>,
      { ...size }
    );
  }

  return new ImageResponse(
    <div
      style={{
        width: size.width,
        height: size.height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: post.imageUrl
          ? `url(${post.imageUrl}) center/cover no-repeat`
          : "#1e293b",
        color: "white",
        padding: 64,
        boxSizing: "border-box",
        fontFamily: "Vazirmatn, Tahoma, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 52,
          fontWeight: 800,
          textShadow: "0 2px 16px #222",
          lineHeight: 1.1,
          background: "rgba(30,41,59,0.7)",
          borderRadius: 16,
          padding: "16px 32px",
          maxWidth: "1000px",
        }}
      >
        {post.metaTitle || post.title}
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 28,
          fontWeight: 500,
          opacity: 0.85,
        }}
      >
        dev-platform.ir
      </div>
    </div>,
    { ...size }
  );
}
