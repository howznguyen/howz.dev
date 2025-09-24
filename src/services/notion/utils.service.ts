import { CollectionInstance, Block } from "notion-types";
import { cleanText } from "@/lib/helpers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// Types for NotionAPI blocks conversion
type AnyRecord = Record<string, any>;

type NotionText = {
  type: "text";
  text: { content: string; link?: { url: string } | null };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
  };
  plain_text?: string;
};

type ParagraphBlock = {
  object: "block";
  id: string;
  type: "paragraph";
  created_time?: number | string | null;
  last_edited_time?: number | string | null;
  has_children: boolean;
  paragraph: { rich_text: NotionText[] };
  children?: NotionApiBlock[];
};

type HeadingBlock = {
  object: "block";
  id: string;
  type: "heading_1" | "heading_2" | "heading_3";
  created_time?: number | string | null;
  last_edited_time?: number | string | null;
  has_children: boolean;
  heading_1?: { rich_text: NotionText[] };
  heading_2?: { rich_text: NotionText[] };
  heading_3?: { rich_text: NotionText[] };
  children?: NotionApiBlock[];
};

type BulletedItemBlock = {
  object: "block";
  id: string;
  type: "bulleted_list_item";
  created_time?: number | string | null;
  last_edited_time?: number | string | null;
  has_children: boolean;
  bulleted_list_item: { rich_text: NotionText[] };
  children?: NotionApiBlock[];
};

type NumberedItemBlock = {
  object: "block";
  id: string;
  type: "numbered_list_item";
  created_time?: number | string | null;
  last_edited_time?: number | string | null;
  has_children: boolean;
  numbered_list_item: { rich_text: NotionText[] };
  children?: NotionApiBlock[];
};

type CalloutBlock = {
  object: "block";
  id: string;
  type: "callout";
  created_time?: number | string | null;
  last_edited_time?: number | string | null;
  has_children: boolean;
  callout: {
    rich_text: NotionText[];
    icon?:
      | { type: "emoji"; emoji: string }
      | { type: "external"; external: { url: string } };
  };
  children?: NotionApiBlock[];
};

type BookmarkBlock = {
  object: "block";
  id: string;
  type: "bookmark";
  created_time?: number | string | null;
  last_edited_time?: number | string | null;
  has_children: boolean;
  bookmark: {
    url: string;
    title?: string;
    description?: string;
    caption?: NotionText[];
    cover?: string;
    icon?: string;
  };
  children?: NotionApiBlock[];
};

type ImageBlock = {
  object: "block";
  id: string;
  type: "image";
  created_time?: number | string | null;
  last_edited_time?: number | string | null;
  has_children: boolean;
  image: { type: "external"; external: { url: string } };
  children?: NotionApiBlock[];
};

type VideoBlock = {
  object: "block";
  id: string;
  type: "video";
  created_time?: number | string | null;
  last_edited_time?: number | string | null;
  has_children: boolean;
  video: {
    type: "external";
    external: { url: string };
    caption?: NotionText[];
  };
  children?: NotionApiBlock[];
};

type QuoteBlock = {
  object: "block";
  id: string;
  type: "quote";
  created_time?: number | string | null;
  last_edited_time?: number | string | null;
  has_children: boolean;
  quote: { rich_text: NotionText[] };
  children?: NotionApiBlock[];
};

type CodeBlock = {
  object: "block";
  id: string;
  type: "code";
  created_time?: number | string | null;
  last_edited_time?: number | string | null;
  has_children: boolean;
  code: {
    rich_text: NotionText[];
    language?: string;
    caption?: NotionText[];
  };
  children?: NotionApiBlock[];
};

type ColumnListBlock = {
  object: "block";
  id: string;
  type: "column_list";
  created_time?: number | string | null;
  last_edited_time?: number | string | null;
  has_children: boolean;
  column_list: {};
  children?: NotionApiBlock[];
};

type ColumnBlock = {
  object: "block";
  id: string;
  type: "column";
  created_time?: number | string | null;
  last_edited_time?: number | string | null;
  has_children: boolean;
  column: {};
  children?: NotionApiBlock[];
};

type UnsupportedBlock = {
  object: "block";
  id: string;
  type: "unsupported";
  created_time?: number | string | null;
  last_edited_time?: number | string | null;
  has_children: boolean;
  children?: NotionApiBlock[];
};

export type NotionApiBlock =
  | ParagraphBlock
  | HeadingBlock
  | BulletedItemBlock
  | NumberedItemBlock
  | CalloutBlock
  | BookmarkBlock
  | ImageBlock
  | VideoBlock
  | QuoteBlock
  | CodeBlock
  | ColumnListBlock
  | ColumnBlock
  | UnsupportedBlock;

// Helper functions for conversion
function textToRich(text: string | undefined | null): NotionText[] {
  return [
    {
      type: "text",
      text: { content: text ?? "" },
    },
  ];
}

function convertRichTextToNotionText(prop: any): NotionText[] {
  if (!prop || !Array.isArray(prop)) {
    return textToRich("");
  }

  const result: NotionText[] = [];

  for (const segment of prop) {
    if (!Array.isArray(segment) || segment.length === 0) continue;

    const [text, annotations] = segment;
    if (typeof text !== "string") continue;

    const notionText: NotionText = {
      type: "text",
      text: { content: text },
    };

    // Handle annotations if present
    if (Array.isArray(annotations) && annotations.length > 0) {
      // annotations is an array of annotation arrays
      const annotationFlags = {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
      };

      // Check each annotation array
      for (const annotation of annotations) {
        if (Array.isArray(annotation) && annotation.length > 0) {
          const flag = annotation[0];
          if (typeof flag === "string") {
            switch (flag) {
              case "b":
                annotationFlags.bold = true;
                break;
              case "i":
                annotationFlags.italic = true;
                break;
              case "s":
                annotationFlags.strikethrough = true;
                break;
              case "_":
                annotationFlags.underline = true;
                break;
              case "c":
                annotationFlags.code = true;
                break;
              case "d":
                if (
                  annotation.length > 1 &&
                  typeof annotation[1] === "object"
                ) {
                  const datetimeData = annotation[1];
                  if (datetimeData.type === "datetime") {
                    // Convert to ISO string for display
                    const dateStr = datetimeData.start_date;
                    const timeStr = datetimeData.start_time;
                    const timezone = datetimeData.time_zone;

                    if (dateStr) {
                      let isoString = dateStr;
                      if (timeStr) {
                        isoString += `T${timeStr}`;
                      }
                      if (timezone) {
                        isoString += ` (${timezone})`;
                      }

                      // Update text content with formatted datetime
                      notionText.text.content = isoString;
                    }
                  }
                }
                break;
            }
          }
        }
      }

      // Apply annotations if any are present
      if (Object.values(annotationFlags).some(Boolean)) {
        notionText.annotations = annotationFlags;
      }

      // Handle links (check if any annotation contains a link)
      for (const annotation of annotations) {
        if (Array.isArray(annotation) && annotation.length > 1) {
          const linkData = annotation[1];
          if (typeof linkData === "string" && linkData.startsWith("http")) {
            notionText.text.link = { url: linkData };
            break;
          }
        }
      }
    }

    result.push(notionText);
  }

  return result.length > 0 ? result : textToRich("");
}

function extractPlainFromTitle(prop: any): string {
  if (!prop) return "";
  let buf = "";
  for (const seg of prop as any[]) {
    if (Array.isArray(seg) && seg.length > 0) {
      const t = seg[0];
      if (typeof t === "string") buf += t;
    } else if (typeof seg === "string") {
      buf += seg;
    }
  }
  return buf;
}

function getPropUrl(props: AnyRecord | undefined, key: string): string | null {
  if (!props) return null;
  const v = props[key];
  if (
    Array.isArray(v) &&
    v.length > 0 &&
    Array.isArray(v[0]) &&
    v[0].length > 0
  ) {
    const url = v[0][0];
    return typeof url === "string" ? url : null;
  }
  return null;
}

function pickImageUrl(raw: AnyRecord): string | null {
  const fmt = raw?.format ?? {};
  const props = raw?.properties ?? {};
  const ds = fmt?.display_source;
  if (typeof ds === "string" && ds) {
    return defaultMapImageUrl(ds, raw as Block);
  }
  const src = props?.source;
  if (
    Array.isArray(src) &&
    src.length > 0 &&
    Array.isArray(src[0]) &&
    src[0][0]
  ) {
    return defaultMapImageUrl(src[0][0], raw as Block);
  }
  return null;
}

function pickVideoUrl(raw: AnyRecord): string | null {
  const fmt = raw?.format ?? {};
  const props = raw?.properties ?? {};

  // Check source property first (direct video URL)
  const src = props?.source;
  if (
    Array.isArray(src) &&
    src.length > 0 &&
    Array.isArray(src[0]) &&
    src[0][0]
  ) {
    return src[0][0];
  }

  // Fallback to display_source (for embedded videos)
  const ds = fmt?.display_source;
  if (typeof ds === "string" && ds) {
    return ds;
  }

  return null;
}

function getBookmarkMetadata(raw: AnyRecord): {
  title?: string;
  description?: string;
  cover?: string;
  icon?: string;
} {
  const fmt = raw?.format ?? {};
  const props = raw?.properties ?? {};

  const coverUrl = fmt?.bookmark_cover;
  const mappedCover = coverUrl
    ? defaultMapImageUrl(coverUrl, raw as Block)
    : undefined;

  return {
    title: extractPlainFromTitle(props?.title) || undefined,
    description: extractPlainFromTitle(props?.description) || undefined,
    cover: mappedCover || undefined,
    icon: fmt?.bookmark_icon || undefined,
  };
}

function getCodeLanguage(raw: AnyRecord): string | undefined {
  const props = raw?.properties ?? {};
  const language = props?.language;

  // Check if language is in properties.language array format
  if (
    Array.isArray(language) &&
    language.length > 0 &&
    Array.isArray(language[0]) &&
    language[0].length > 0
  ) {
    const lang = language[0][0];
    return typeof lang === "string" ? lang : undefined;
  }

  // Fallback to format.code_language
  const fmt = raw?.format ?? {};
  const fmtLanguage = fmt?.code_language;
  return typeof fmtLanguage === "string" ? fmtLanguage : undefined;
}

export interface ConvertedPost {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  tags: string[];
  published: Date | null;
  status: string | null;
  featured: boolean;
  createdTime: number;
  lastEditedTime: number;
  content: string[];
  cover?: string | null;
  readingTime?: number;
  contents?: any[];
  views?: number; // Added for Umami analytics integration
}

/**
 * Build schema map from property name to property ID
 */
function buildSchemaNameToIdMap(recordMap: any): Record<string, string> {
  const collections = recordMap.collection;
  const firstCollectionId = Object.keys(collections || {})[0];
  if (!firstCollectionId) return {};

  const schema = collections[firstCollectionId]?.value?.schema || {};
  const map: Record<string, string> = {};

  for (const [propId, meta] of Object.entries(schema)) {
    if (meta && (meta as any).name) {
      map[(meta as any).name] = propId;
    }
  }

  return map;
}

/**
 * Extract plain text from Notion rich-text property
 */
function getPlainText(prop: any): string | null {
  if (!prop) return null;

  try {
    if (Array.isArray(prop) && prop.length > 0 && Array.isArray(prop[0])) {
      const first = prop[0];
      if (typeof first[0] === "string") return first[0];
    }
  } catch {}

  return null;
}

/**
 * Extract number from numeric property
 */
function getNumber(prop: any): number | null {
  const text = getPlainText(prop);
  if (text == null) return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

/**
 * Extract tags from multi-select property
 */
function getTags(prop: any): string[] {
  const text = getPlainText(prop);
  if (!text) return [];
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Extract date from date property
 */
function getDate(prop: any): Date | null {
  if (!prop) return null;

  try {
    // Format: [["‣", [["d", {type: "datetime", ...}]]]]
    if (
      Array.isArray(prop) &&
      prop.length > 0 &&
      Array.isArray(prop[0]) &&
      prop[0].length >= 2
    ) {
      const [text, annotations] = prop[0];

      if (
        Array.isArray(annotations) &&
        annotations.length > 0 &&
        Array.isArray(annotations[0]) &&
        annotations[0].length >= 2
      ) {
        const [flag, datetimeData] = annotations[0];

        if (
          flag === "d" &&
          typeof datetimeData === "object" &&
          datetimeData.type === "datetime"
        ) {
          const date = datetimeData.start_date as string | undefined;
          const time = datetimeData.start_time as string | undefined;
          const timezone = datetimeData.time_zone as string | undefined;

          const datetimeStr = `${date} ${time}`;

          const localTime = dayjs.tz(datetimeStr, "YYYY-MM-DD HH:mm", timezone);

          if (localTime.isValid()) {
            return localTime.toDate();
          }
        }
      }
    }
  } catch (e) {
    console.log("Error parsing date:", e);
  }

  return null;
}

/**
 * Extract boolean from checkbox property
 */
function getBoolean(prop: any): boolean {
  const text = getPlainText(prop);
  return text === "Yes" || text === "true" || prop === true;
}

/**
 * Convert raw Notion collection response to clean post objects
 */
export function convertNotionResponseToPosts(
  rawResponse: CollectionInstance
): ConvertedPost[] {
  if (!rawResponse?.recordMap?.block) {
    return [];
  }

  const schemaMap = buildSchemaNameToIdMap(rawResponse.recordMap);
  const blocks =
    rawResponse.result?.reducerResults?.collection_group_results?.blockIds ??
    [];
  const results: ConvertedPost[] = [];

  for (const blockId of blocks) {
    const block = rawResponse.recordMap.block[blockId];
    if (!block?.value) continue;

    const props = block.value.properties ?? {};

    const getProp = (name: string) => {
      const id = schemaMap[name];
      return id ? props[id] : undefined;
    };

    const titleText = getPlainText(getProp("title")) ?? "";
    const slugText = getPlainText(getProp("slug"));
    const descText = getPlainText(getProp("description"));
    const tagsArr = getTags(getProp("tags"));
    const statusText = getPlainText(getProp("status"));
    const viewsNum = getNumber(getProp("views"));
    const publishedText = getDate(getProp("published"));
    const featuredBool = getBoolean(getProp("featured"));

    // Get cover image
    const coverUrl = block.value.format?.page_cover || null;
    const mappedCoverUrl = coverUrl
      ? defaultMapImageUrl(coverUrl, block.value)
      : null;

    results.push({
      id: block.value.id,
      title: cleanText(titleText),
      slug: slugText ? cleanText(slugText) : null,
      description: descText ? cleanText(descText) : null,
      tags: tagsArr,
      published: publishedText,
      status: statusText || null,
      featured: featuredBool,
      createdTime: block.value.created_time || 0,
      lastEditedTime: block.value.last_edited_time || 0,
      content: block.value.content || [],
      cover: mappedCoverUrl,
    });
  }

  return results;
}

/**
 * Filter posts by status
 */
export function filterPublishedPosts(posts: ConvertedPost[]): ConvertedPost[] {
  return posts.filter((post) => post.status === "Published");
}

/**
 * Filter posts by tags
 */
export function filterPostsByTags(
  posts: ConvertedPost[],
  tags: string[]
): ConvertedPost[] {
  return posts.filter((post) => tags.some((tag) => post.tags.includes(tag)));
}

/**
 * Sort posts by published date (newest first)
 */
export function sortPostsByDate(posts: ConvertedPost[]): ConvertedPost[] {
  return posts.sort((a, b) => {
    if (!a.published && !b.published) return 0;
    if (!a.published) return 1;
    if (!b.published) return -1;

    return b.published.getTime() - a.published.getTime();
  });
}

/**
 * Sort posts by published date (newest first) - replacing sortPostsByViews
 */
export function sortPostsByViews(posts: ConvertedPost[]): ConvertedPost[] {
  return sortPostsByDate(posts);
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(posts: ConvertedPost[]): ConvertedPost[] {
  return posts.filter((post) => post.featured);
}

/**
 * Search posts by title or description
 */
export function searchPosts(
  posts: ConvertedPost[],
  query: string
): ConvertedPost[] {
  const lowercaseQuery = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      (post.description &&
        post.description.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Get unique tags from all posts
 */
export function getAllTags(posts: ConvertedPost[]): string[] {
  const tagSet = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

/**
 * Get tags with post counts
 */
export function getTagsWithCounts(
  posts: ConvertedPost[]
): { name: string; count: number }[] {
  const tagCounts = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); // Sort by count descending
}

/**
 * Get posts by tag
 */
export function getPostsByTag(
  posts: ConvertedPost[],
  tag: string
): ConvertedPost[] {
  return posts.filter((post) => post.tags.includes(tag));
}

/**
 * Get post by slug
 */
export function getPostBySlug(
  posts: ConvertedPost[],
  slug: string
): ConvertedPost | undefined {
  return posts.find((post) => post.slug === slug);
}

/**
 * Get related posts (same tags, excluding current post)
 */
export function getRelatedPosts(
  posts: ConvertedPost[],
  currentPost: ConvertedPost,
  limit: number = 3
): ConvertedPost[] {
  const relatedPosts = posts.filter(
    (post) =>
      post.id !== currentPost.id &&
      post.tags.some((tag) => currentPost.tags.includes(tag))
  );

  return relatedPosts.slice(0, limit);
}

/**
 * Convert Notion recordMap (from notion-client/react-notion-x) to Notion API block structure with children
 */
export function convertRecordMapToApiBlocks(
  recordMap: AnyRecord,
  rootPageId?: string
): NotionApiBlock[] {
  const blocks: AnyRecord = recordMap?.block ?? {};
  if (!blocks || typeof blocks !== "object") {
    throw new Error("Invalid recordMap: missing `block`");
  }

  // determine root page
  let root: AnyRecord | null = null;
  if (rootPageId && blocks[rootPageId]?.value?.type === "page") {
    root = blocks[rootPageId].value;
  } else {
    // fallback: first page with content
    for (const bid of Object.keys(blocks)) {
      const v = blocks[bid]?.value;
      if (v?.type === "page" && Array.isArray(v?.content)) {
        root = v;
        break;
      }
    }
  }
  if (!root) throw new Error("Could not locate a root page in recordMap.");

  const seen = new Set<string>();

  const convertOne = (raw: AnyRecord): NotionApiBlock => {
    const id: string = raw?.id;
    const type: string = raw?.type;
    const props: AnyRecord = raw?.properties ?? {};
    const fmt: AnyRecord = raw?.format ?? {};
    const created = raw?.created_time ?? null;
    const edited = raw?.last_edited_time ?? null;
    const content: string[] = Array.isArray(raw?.content) ? raw.content : [];

    // base
    const hasChildren = content.length > 0;

    // map types
    if (type === "text" || type === "paragraph") {
      const richText = convertRichTextToNotionText(props?.title);
      const out: ParagraphBlock = {
        object: "block",
        id,
        type: "paragraph",
        created_time: created,
        last_edited_time: edited,
        has_children: hasChildren,
        paragraph: { rich_text: richText },
      };
      if (hasChildren) out.children = convertChildren(content);
      return out;
    }

    if (
      type === "header" ||
      type === "sub_header" ||
      type === "sub_sub_header"
    ) {
      const richText = convertRichTextToNotionText(props?.title);
      const key =
        type === "header"
          ? "heading_1"
          : type === "sub_header"
          ? "heading_2"
          : "heading_3";
      const out: HeadingBlock = {
        object: "block",
        id,
        // @ts-ignore
        type: key,
        created_time: created,
        last_edited_time: edited,
        has_children: hasChildren,
        // @ts-ignore
        [key]: { rich_text: richText },
      };
      if (hasChildren) out.children = convertChildren(content);
      return out;
    }

    if (type === "bulleted_list") {
      const richText = convertRichTextToNotionText(props?.title);
      const out: BulletedItemBlock = {
        object: "block",
        id,
        type: "bulleted_list_item",
        created_time: created,
        last_edited_time: edited,
        has_children: hasChildren,
        bulleted_list_item: { rich_text: richText },
      };
      if (hasChildren) out.children = convertChildren(content);
      return out;
    }

    if (type === "numbered_list") {
      const richText = convertRichTextToNotionText(props?.title);
      const out: NumberedItemBlock = {
        object: "block",
        id,
        type: "numbered_list_item",
        created_time: created,
        last_edited_time: edited,
        has_children: hasChildren,
        numbered_list_item: { rich_text: richText },
      };
      if (hasChildren) out.children = convertChildren(content);
      return out;
    }

    if (type === "callout") {
      const richText = convertRichTextToNotionText(props?.title);
      const emoji = fmt?.page_icon;
      const callout: CalloutBlock["callout"] = { rich_text: richText };
      if (emoji && typeof emoji === "string") {
        callout.icon = { type: "emoji", emoji };
      }
      const out: CalloutBlock = {
        object: "block",
        id,
        type: "callout",
        created_time: created,
        last_edited_time: edited,
        has_children: hasChildren,
        callout,
      };
      if (hasChildren) out.children = convertChildren(content);
      return out;
    }

    if (type === "bookmark") {
      const url = getPropUrl(props, "link") ?? "";
      const metadata = getBookmarkMetadata(raw);
      const out: BookmarkBlock = {
        object: "block",
        id,
        type: "bookmark",
        created_time: created,
        last_edited_time: edited,
        has_children: hasChildren,
        bookmark: {
          url,
          title: metadata.title,
          description: metadata.description,
          cover: metadata.cover,
          icon: metadata.icon,
        },
      };
      if (hasChildren) out.children = convertChildren(content);
      return out;
    }

    if (type === "image") {
      const url = pickImageUrl(raw) ?? "";
      const out: ImageBlock = {
        object: "block",
        id,
        type: "image",
        created_time: created,
        last_edited_time: edited,
        has_children: hasChildren,
        image: { type: "external", external: { url } },
      };
      if (hasChildren) out.children = convertChildren(content);
      return out;
    }

    if (type === "video") {
      const url = pickVideoUrl(raw) ?? "";
      const out: VideoBlock = {
        object: "block",
        id,
        type: "video",
        created_time: created,
        last_edited_time: edited,
        has_children: hasChildren,
        video: { type: "external", external: { url } },
      };
      if (hasChildren) out.children = convertChildren(content);
      return out;
    }

    if (type === "quote") {
      const richText = convertRichTextToNotionText(props?.title);
      const out: QuoteBlock = {
        object: "block",
        id,
        type: "quote",
        created_time: created,
        last_edited_time: edited,
        has_children: hasChildren,
        quote: { rich_text: richText },
      };
      if (hasChildren) out.children = convertChildren(content);
      return out;
    }

    if (type === "code") {
      const richText = convertRichTextToNotionText(props?.title);
      const language = getCodeLanguage(raw);
      const out: CodeBlock = {
        object: "block",
        id,
        type: "code",
        created_time: created,
        last_edited_time: edited,
        has_children: hasChildren,
        code: {
          rich_text: richText,
          language: language,
        },
      };
      if (hasChildren) out.children = convertChildren(content);
      return out;
    }

    if (type === "column_list") {
      const out: ColumnListBlock = {
        object: "block",
        id,
        type: "column_list",
        created_time: created,
        last_edited_time: edited,
        has_children: hasChildren,
        column_list: {},
      };
      if (hasChildren) out.children = convertChildren(content);
      return out;
    }

    if (type === "column") {
      const out: ColumnBlock = {
        object: "block",
        id,
        type: "column",
        created_time: created,
        last_edited_time: edited,
        has_children: hasChildren,
        column: {},
      };
      if (hasChildren) out.children = convertChildren(content);
      return out;
    }

    // default fallback
    const out: UnsupportedBlock = {
      object: "block",
      id,
      type: "unsupported",
      created_time: created,
      last_edited_time: edited,
      has_children: hasChildren,
    };
    if (hasChildren) out.children = convertChildren(content);
    return out;
  };

  const convertChildren = (ids: string[]): NotionApiBlock[] => {
    const out: NotionApiBlock[] = [];
    for (const cid of ids) {
      if (seen.has(cid)) continue; // avoid cycles
      const child = blocks[cid]?.value;
      if (!child?.alive) continue;
      seen.add(cid);
      out.push(convertOne(child));
    }
    return out;
  };

  // start from root page's content
  const rootChildren = Array.isArray(root.content) ? root.content : [];
  return rootChildren.map((cid: string) => {
    const v = blocks[cid]?.value;
    return v
      ? convertOne(v)
      : ({
          object: "block",
          id: cid,
          type: "unsupported",
          has_children: false,
        } as UnsupportedBlock);
  });
}

/**
 * Map Notion image URLs to proper format
 */
export const defaultMapImageUrl = (
  url: string,
  block: Block
): string | null => {
  if (!url) {
    return null;
  }

  if (url.startsWith("data:")) {
    return url;
  }

  // more recent versions of notion don't proxy unsplash images
  if (url.startsWith("https://images.unsplash.com")) {
    return url;
  }

  try {
    const u = new URL(url);

    if (
      u.pathname.startsWith("/secure.notion-static.com") &&
      u.hostname.endsWith(".amazonaws.com")
    ) {
      if (
        u.searchParams.has("X-Amz-Credential") &&
        u.searchParams.has("X-Amz-Signature") &&
        u.searchParams.has("X-Amz-Algorithm")
      ) {
        // if the URL is already signed, then use it as-is
        return url;
      }
    }
  } catch {
    // ignore invalid urls
  }

  if (url.startsWith("/images")) {
    url = `https://www.notion.so${url}`;
  }

  url = `https://www.notion.so${
    url.startsWith("/image") ? url : `/image/${encodeURIComponent(url)}`
  }`;

  const notionImageUrlV2 = new URL(url);
  let table = block.parent_table === "space" ? "block" : block.parent_table;
  if (table === "collection" || table === "team") {
    table = "block";
  }
  notionImageUrlV2.searchParams.set("table", table);
  notionImageUrlV2.searchParams.set("id", block.id);
  notionImageUrlV2.searchParams.set("cache", "v2");

  url = notionImageUrlV2.toString();

  return url;
};
