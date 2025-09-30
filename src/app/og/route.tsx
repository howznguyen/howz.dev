import { ImageResponse } from "next/og";
import Notion from "@/services/notion";
import site from "@/datas/site";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Check if slug is provided for auto-fetching post data
  const slug = searchParams.get("slug");

  let title,
    description,
    publishedAt,
    iconEmoji,
    cover,
    authorName,
    authorAvatar;

  if (slug) {
    try {
      // Auto-fetch post data when slug is provided
      const blogPost = await Notion.getPostBySlug(slug);

      if (blogPost) {
        title = blogPost.title;
        description =
          blogPost.description || site.branding.og_description_fallback;
        publishedAt = blogPost.createdAt
          ? new Date(blogPost.createdAt).toLocaleDateString()
          : new Date().toLocaleDateString();
        iconEmoji = blogPost.icon || "✨";
        cover = blogPost.cover?.url || null;
        authorName = site.author.name;
        authorAvatar = site.author.avatar;
      } else {
        // Fallback if post not found
        title = "Post Not Found";
        description = "The requested post could not be found.";
        publishedAt = new Date().toLocaleDateString();
        iconEmoji = "❌";
        cover = null;
        authorName = site.author.name;
        authorAvatar = site.author.avatar;
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
      // Fallback on error
      title = "Error Loading Post";
      description = "There was an error loading the post data.";
      publishedAt = new Date().toLocaleDateString();
      iconEmoji = "⚠️";
      cover = null;
      authorName = site.author.name;
      authorAvatar = site.author.avatar;
    }
  } else {
    // Read params (fallbacks) - original behavior when no slug
    title = searchParams.get("title") ?? site.branding.og_title_fallback;
    description =
      searchParams.get("description") ?? site.branding.og_description_fallback;
    publishedAt =
      searchParams.get("publishedAt") ?? new Date().toLocaleDateString();
    iconEmoji = searchParams.get("icon") ?? "✨"; // ← emoji icon
    cover = searchParams.get("cover") ?? null;
    authorName = searchParams.get("authorName") ?? site.author.name;
    authorAvatar = searchParams.get("authorAvatar") ?? site.author.avatar; // demo url
  }

  // Sizes for canvas & images
  const W = 1200;
  const H = 630;
  const AVATAR = 72;

  // Simple gradient bg if no cover
  const baseBg = "linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)";

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
        }}
      >
        {/* Cover (optional). Remember: width/height required */}
        {cover ? (
          <img
            src={cover}
            width={W}
            height={H}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              objectFit: "cover",
              filter: "brightness(0.6)",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: W,
              height: H,
              backgroundColor: "#053345",
            }}
          ></div>
        )}

        {/* Overlay content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "56px 80px",
            width: "100%",
            height: "100%",
            color: "white",
          }}
        >
          {/* Row: emoji + date */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 40,
                lineHeight: 1,
              }}
            >
              {iconEmoji}
            </div>
            <div
              style={{
                fontSize: 26,
                opacity: 0.95,
              }}
            >
              {publishedAt}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 20,
              textShadow: "0 2px 8px rgba(0,0,0,0.35)",
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 32,
              maxWidth: 880,
              opacity: 0.9,
              marginBottom: 40,
            }}
          >
            {description}
          </div>

          {/* Author */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            {/* Avatar: width/height required */}
            <img
              src={authorAvatar}
              width={AVATAR}
              height={AVATAR}
              style={{
                borderRadius: "50%",
                border: "3px solid rgba(255,255,255,0.9)",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                }}
              >
                {authorName}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
