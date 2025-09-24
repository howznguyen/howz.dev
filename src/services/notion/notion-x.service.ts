import { NotionAPI } from "notion-client";
import { ExtendedRecordMap } from "notion-types";

export const notionX = new NotionAPI({
  activeUser: process.env.NOTION_ACTIVE_USER,
  authToken: process.env.NOTION_TOKEN_V2,
  ofetchOptions: {
    // fetchOptions từ ofetch
    onRequest: ({ request, options }: { request: any; options: any }) => {
      const url = request.toString();

      if (url.includes("/api/v3/syncRecordValues")) {
        return new Request(
          url.replace(
            "/api/v3/syncRecordValues",
            "/api/v3/syncRecordValuesMain"
          ),
          options
        );
      }

      return request;
    },
  },
});

export async function getPage(pageId: string) {
  try {
    const recordMap = await notionX.getPage(pageId);
    const newRecordMap = await fixMissingBlocks(recordMap);
    return newRecordMap;
  } catch (error: any) {
    console.error("NotionAPI getPage error:", error);

    // Handle specific Notion API errors
    if (
      error.message?.includes("getSignedfileUrls") ||
      error.message?.includes("502") ||
      error.message?.includes("Bad Gateway")
    ) {
      console.log("Notion API error detected, retrying...");

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        const recordMap = await notionX.getPage(pageId);
        const newRecordMap = await fixMissingBlocks(recordMap);
        return newRecordMap;
      } catch (retryError) {
        console.error("NotionAPI retry failed:", retryError);

        // If retry fails, return empty recordMap to prevent build failure
        console.log("Returning empty recordMap to prevent build failure");
        return {
          block: {},
          collection: {},
          collection_view: {},
          notion_user: {},
          signed_urls: {},
          preview_images: {},
        };
      }
    }

    throw error;
  }
}

async function fixMissingBlocks(
  recordMap: ExtendedRecordMap
): Promise<ExtendedRecordMap> {
  const brokenBlockIds = [] as any;
  for (const blockId of Object.keys(recordMap.block)) {
    const block = recordMap.block[blockId]?.value;
    if (!block || block.type !== "text") {
      continue;
    }
    const title = block.properties?.title;
    if (!title) {
      continue;
    }
    title.map(([_text, decorations], _index) => {
      if (!decorations) {
        return false;
      }
      const decorator = decorations[0];
      if (!decorator || decorator[0] !== "p" || !decorator[1]) {
        return false;
      }
      const bId = decorator[1];
      if (!recordMap.block[bId]?.value) {
        brokenBlockIds.push(bId);
        return true;
      }
      return false;
    });
  }
  const missingBlocks = brokenBlockIds?.length
    ? await notionX.getBlocks(brokenBlockIds)
    : null;
  const newBlocks = {
    ...recordMap.block,
    ...missingBlocks?.recordMap?.block,
  };
  return {
    ...recordMap,
    block: newBlocks,
  };
}
