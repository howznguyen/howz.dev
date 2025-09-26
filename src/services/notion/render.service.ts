import { createSlugFromTitleAndUuid } from "@/lib/helpers";
import type { Block, ExtendedRecordMap } from "notion-types";

export interface NotionHeading {
  type: "heading_1" | "heading_2" | "heading_3";
  id: string;
  text: string;
  level: number;
}

export class NotionRenderService {
  /**
   * Extract plain text from a Notion record map.
   */
  static extractPlainText(recordMap: ExtendedRecordMap): string {
    if (!recordMap?.block) {
      return "";
    }

    const textParts: string[] = [];

    for (const blockId of Object.keys(recordMap.block)) {
      const entry = recordMap.block[blockId];
      const value = entry?.value;
      if (!value) {
        continue;
      }

      const title = value.properties?.title;
      const plain = this.getTextFromProperties(title);
      if (plain) {
        textParts.push(plain);
      }
    }

    return textParts.join(" ").replace(/\s+/g, " ").trim();
  }

  /**
   * Extract headings (H1-H3) from the record map by walking the page tree.
   */
  static extractHeadings(
    recordMap: ExtendedRecordMap,
    rootPageId: string
  ): NotionHeading[] {
    if (!recordMap?.block || !rootPageId) {
      return [];
    }

    const headings: NotionHeading[] = [];
    const visited = new Set<string>();

    const walk = (blockId: string) => {
      if (!blockId || visited.has(blockId)) {
        return;
      }

      visited.add(blockId);
      const blockEntry = recordMap.block[blockId];
      const block = blockEntry?.value as Block | undefined;

      if (!block) {
        return;
      }

      const heading = this.blockToHeading(block);
      if (heading) {
        headings.push(heading);
      }

      const children = Array.isArray(block.content) ? block.content : [];
      for (const childId of children) {
        walk(childId);
      }
    };

    walk(rootPageId);
    return headings;
  }

  private static blockToHeading(block: Block): NotionHeading | null {
    const headingTypeMap: Record<
      string,
      { type: "heading_1" | "heading_2" | "heading_3"; level: number }
    > = {
      header: { type: "heading_1", level: 1 },
      sub_header: { type: "heading_2", level: 2 },
      sub_sub_header: { type: "heading_3", level: 3 },
      heading_1: { type: "heading_1", level: 1 },
      heading_2: { type: "heading_2", level: 2 },
      heading_3: { type: "heading_3", level: 3 },
    };

    const mapping = headingTypeMap[block.type];
    if (!mapping) {
      return null;
    }

    const text = this.getTextFromProperties(block.properties?.title);
    if (!text) {
      return null;
    }

    const uuid = block.id.replace(
      /([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})/,
      "$1-$2-$3-$4-$5"
    );

    const slug = createSlugFromTitleAndUuid(text, uuid);

    return {
      type: mapping.type,
      id: slug,
      text,
      level: mapping.level,
    };
  }

  private static getTextFromProperties(title: any): string {
    if (!Array.isArray(title)) {
      return "";
    }

    return title
      .map((segment) => {
        if (Array.isArray(segment) && segment.length > 0) {
          return segment[0] ?? "";
        }
        return "";
      })
      .join("")
      .trim();
  }
}

export default NotionRenderService;
