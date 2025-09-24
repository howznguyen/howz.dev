import { NextResponse } from "next/server";
import { umamiService } from "@/services/umami/umami.service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") ?? "/";

  try {
    // Use the Umami service to get pageviews for this specific URL
    const views = await umamiService.getViewsByPostSlug(slug);

    return NextResponse.json({
      slug,
      total: views,
    });
  } catch (error) {
    console.error("Error fetching Umami data:", error);
    return NextResponse.json(
      {
        error: "fetch_error",
        slug,
        total: 0,
      },
      { status: 200 }
    );
  }
}
