"use client";

import { NotionRenderBlock } from "@/services/notion/render.service";
import {
  NotionHeading,
  NotionParagraph,
  NotionBlockquote,
  NotionCallout,
  NotionCode,
  NotionImage,
  NotionList,
  NotionToggle,
  NotionBookmark,
  NotionTable,
  NotionEmbed,
  NotionVideo,
  NotionDivider,
} from "./index";
import { RichText } from "./RichText";

interface BlockProps {
  block: NotionRenderBlock;
  isChild?: boolean;
}

export const Block = ({ block, isChild = false }: BlockProps) => {
  const { type, key } = block;

  switch (type) {
    case "paragraph":
      if (isChild) {
        return <RichText richText={block.richText || []} />;
      } else
        return (
          <NotionParagraph key={key}>
            <RichText richText={block.richText || []} />
          </NotionParagraph>
        );

    case "heading_1":
    case "heading_2":
    case "heading_3":
      return (
        <NotionHeading key={key} type={type} id={block.id}>
          <RichText richText={block.richText || []} />
        </NotionHeading>
      );

    case "blockquote":
      return (
        <NotionBlockquote key={key}>
          {block.hasChildren && block.children && (
            <div>
              {block.children.map((child, index) => (
                <Block key={index} block={child} isChild={true} />
              ))}
            </div>
          )}
        </NotionBlockquote>
      );

    case "callout":
      console.log(block);
      return (
        <NotionCallout key={key} emoji={block.emoji || "💡"}>
          {block.hasChildren && block.children && (
            <div>
              {block.children.map((child, index) => (
                <Block key={index} block={child} isChild={true} />
              ))}
            </div>
          )}
        </NotionCallout>
      );

    case "code":
      return (
        <NotionCode key={key} language={block.language}>
          {block.content || ""}
        </NotionCode>
      );

    case "image":
      if (!block.url) return null;
      return (
        <NotionImage
          key={key}
          src={block.url}
          alt={block.caption || "Image"}
          caption={block.caption}
        />
      );

    case "bulleted_list_item":
      return (
        <NotionList key={key}>
          <li>
            <RichText richText={block.richText || []} />
            {block.hasChildren && block.children && (
              <div className="ml-4 mt-2">
                {block.children.map((child, index) => (
                  <Block key={index} block={child} isChild={true} />
                ))}
              </div>
            )}
          </li>
        </NotionList>
      );

    case "numbered_list_item":
      return (
        <NotionList key={key} ordered number={block.number}>
          <li>
            <RichText richText={block.richText || []} />
            {block.hasChildren && block.children && (
              <div className="ml-4 mt-2">
                {block.children.map((child, index) => (
                  <Block key={index} block={child} isChild={true} />
                ))}
              </div>
            )}
          </li>
        </NotionList>
      );

    case "toggle":
      return (
        <NotionToggle
          key={key}
          title={<RichText richText={block.richText || []} />}
        >
          {block.hasChildren && block.children && (
            <div>
              {block.children.map((child, index) => (
                <Block key={index} block={child} isChild={true} />
              ))}
            </div>
          )}
        </NotionToggle>
      );

    case "bookmark":
      if (!block.url) return null;
      return (
        <NotionBookmark
          key={key}
          block={{
            type: "bookmark",
            bookmark: {
              url: block.url,
              title: block.title,
              description: block.description,
              cover: block.cover,
              icon: block.icon,
            },
          }}
        />
      );

    case "embed":
      if (!block.url) return null;
      return <NotionEmbed key={key} url={block.url} />;

    case "video":
      if (!block.url) return null;
      return <NotionVideo key={key} url={block.url} />;

    case "table":
      if (!block.data) return null;
      return (
        <NotionTable key={key} data={block.data} options={block.options} />
      );

    case "divider":
      return <NotionDivider key={key} />;

    default:
      // Fallback to paragraph for unknown types
      return (
        <NotionParagraph key={key}>
          <RichText richText={block.richText || []} />
        </NotionParagraph>
      );
  }
};
