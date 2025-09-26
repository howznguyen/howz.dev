"use client";

import React, { useMemo, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { Block, ExtendedRecordMap } from "notion-types";

import { defaultMapImageUrl } from "@/services/notion/utils.service";

import { NotionRichText } from "./blocks";
import { Block as ExtendedBlock } from "./blocks/Block";
import { NotionProvider, useNotionContext } from "./NotionContext";

const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  { ssr: false }
);

const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  { ssr: false }
);

interface NotionRendererProps {
  recordMap: ExtendedRecordMap;
  pageUrlMap?: Record<string, string>;
  className?: string;
  darkMode?: boolean;
}

let prismLanguagesLoaded = false;

function normalizeId(value: string | undefined | null): string {
  return (value || "").replace(/-/g, "").toLowerCase();
}

export const NotionRenderer: React.FC<NotionRendererProps> = ({
  recordMap,
  pageUrlMap,
  className,
  darkMode = false,
}) => {
  const hasRecordMap = Boolean(recordMap && recordMap.block);

  const prismLoadedRef = useRef(prismLanguagesLoaded);

  const Equation = dynamic(() => import("./blocks/BlockEquation"));

  useEffect(() => {
    if (prismLoadedRef.current) {
      return;
    }

    prismLoadedRef.current = true;
    prismLanguagesLoaded = true;

    const loadPrismLanguages = async () => {
      try {
        await import("prismjs");
        // Skip language imports to avoid TypeScript issues
      } catch (error) {
        console.warn("Failed to load Prism language bundle", error);
      }
    };

    void loadPrismLanguages();
  }, []);

  const components = useMemo(
    () => ({
      // Override Block component to handle all custom block rendering
      Block: ExtendedBlock,
      Equation,
      Text: NotionRichText, // Custom text rendering
      // Empty Collection component to suppress warnings
      Collection: () => null,
      Pdf,
      Modal,
    }),
    []
  );

  const resolvedPageUrlMap = useMemo(() => pageUrlMap ?? {}, [pageUrlMap]);

  const mapPageUrl = useMemo(() => {
    const keys = Object.keys(resolvedPageUrlMap);
    if (keys.length === 0) {
      return undefined;
    }

    return (pageId: string) => {
      const normalized = normalizeId(pageId);
      return (
        resolvedPageUrlMap[normalized] || `https://www.notion.so/${normalized}`
      );
    };
  }, [resolvedPageUrlMap]);

  const mapImageUrl = useCallback((url: string | undefined, block: Block) => {
    if (!url) return "";
    const mapped = defaultMapImageUrl(url, block);
    return mapped ?? url;
  }, []);

  if (!hasRecordMap) {
    return null;
  }

  const containerClassName = ["notion-x-container", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClassName}>
      <NotionProvider recordMap={recordMap}>
        <NotionBlockRenderer
          recordMap={recordMap}
          components={components}
          mapPageUrl={mapPageUrl}
          mapImageUrl={mapImageUrl}
          fullPage={false}
          darkMode={darkMode}
          previewImages={!!recordMap.preview_images}
          disableHeader
          className={className}
        />
      </NotionProvider>
    </div>
  );
};

interface NotionBlockRendererProps {
  recordMap: ExtendedRecordMap;
  components?: any;
  mapPageUrl?: any;
  mapImageUrl?: any;
  fullPage?: boolean;
  darkMode?: boolean;
  previewImages?: boolean;
  disableHeader?: boolean;
  className?: string;
  blockId?: string;
  hideBlockId?: boolean;
  level?: number;
}

export const NotionBlockRenderer: React.FC<NotionBlockRendererProps> = ({
  level = 0,
  blockId,
  className,
  ...props
}) => {
  const { recordMap } = useNotionContext();

  if (!recordMap) {
    return null;
  }

  const id = blockId || Object.keys(recordMap.block)[0];
  const block = recordMap.block[id]?.value;

  if (!block) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("missing block", blockId);
    }
    return null;
  }

  return (
    <ExtendedBlock key={id} level={level} block={block} className={className}>
      {block?.content?.map((contentBlockId) => (
        <NotionBlockRenderer
          key={contentBlockId}
          blockId={contentBlockId}
          level={level + 1}
          {...props}
        />
      ))}
    </ExtendedBlock>
  );
};

export default NotionRenderer;
