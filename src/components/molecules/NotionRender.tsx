import {
  Blockquote,
  Callout,
  Paragraph,
  Span,
  Image,
  CodeBlock,
  Heading,
  OrderedList,
  UnorderedList,
  Toggle,
  Bookmark,
  Table,
  Link,
  Embed,
  Video,
} from "@/components/atoms";
import nl2br from "react-nl2br";
interface NotionRenderProps {
  contents: Array<any>;
}


const NotionRender = ({ contents }: NotionRenderProps) => {
  return <>{NotionToReact(contents)}</>;
};

export const NotionToReact = (contents: Array<any>) => {
  return contents.map((content, i) => NotionElementToReact(content, i, contents));
};

export const NotionToHeading = (contents: Array<any>) => {
  let headingTypes = ["heading_1", "heading_2"];

  let heading = contents.filter((content) => headingTypes.includes(content.type));
  if (heading.length > 0) {
    return heading.map((content) => {
      let type = content.type;
      let text = RichTextToReact(content[type].rich_text, {
        getRawContent: true,
      });
      let id = content.id.replace(/-/g, "");
      return {
        type: type,
        id: id,
        text: text,
      };
    });
  }
  return [];
};

export const NotionElementToReact = (content: any, _index: number, contents: Array<any>) => {
  let component = <></>;

  let typeExist = content && "type" in content;
  let type = content.type;
  let text = RichTextToReact(content[type].rich_text ?? []);
  if (typeExist) {
    // Paragraph
    
    if (type === "paragraph") {
      component = <Paragraph key={_index}>{text}</Paragraph>;
    }

    // Divider
    if (type === "divider") {
      component = (
        <hr className="w-48 h-1 mx-auto my-4 bg-gray-400 border-0 rounded md:my-10 dark:bg-gray-700" />
      );
    }

    // Heading
    if (type.includes("heading")) {
      let id = content.id.replace(/-/g, "");
      component = (
          <Heading key={_index} type={type} id={id}>
            <a key={_index} href={`#${id}`}>
              {text}
            </a>
          </Heading>
      );
    }

    // Blockquote
    if (type === "quote") {
      component = <Blockquote>{text}</Blockquote>;
    }

    // Callout
    if (type === "callout") {
      let emoji = content[type].icon.emoji;
      component = <Callout key={_index} emoji={emoji}>{text}</Callout>;
    }

    // Image
    if (type === "image") {
      let url = content[type][content[type].type].url;
      let caption = RichTextToReact(content[type].caption);
      component = <Image key={_index} src={url} alt="" caption={caption} />;
    }

    // Code
    if (type === "code") {
      let language = content[type].language;
      let text = RichTextToReact(content[type].rich_text, {
        getFirstNode: true,
        rawContent: true,
      });
      component = <CodeBlock key={_index} language={language}>{text}</CodeBlock>;
    }

    // Bulleted List
    if (type === "bulleted_list_item") {
      component = (
        <UnorderedList key={_index}>
          <li key={1}>
            {text}
            {content.has_children && NotionToReact(content.children)}
          </li>
        </UnorderedList>
      );
    }

    // Numbered List
    if (type === "numbered_list_item") {
      let index = 1;
      for (let i = 0; i < contents.length; i++) {
        if (contents[i].type === "numbered_list_item") {
          if (i > 0 && contents[i - 1].type === "numbered_list_item") index++;
          else index = 1;
        }
        if (contents[i].id === content.id) break;
      }
      component = (
        <OrderedList key={_index} number={index}>
          <li key={1}>
            {text}
            {content.has_children && NotionToReact(content.children)}
          </li>
        </OrderedList>
      );
    }

    // Toggle
    if (type === "toggle") {
      component = (
        <Toggle key={_index} title={text}>
          {content.has_children && NotionToReact(content.children)}
        </Toggle>
      );
    }

    // Bookmark
    if (type === "bookmark") {
      let url = content[type].url;
      component = <Bookmark key={_index} url={url} />;
    }

    // Embed
    if (type === "embed") {
      let url = content[type].url;
      component = <div className="mb-4 h-auto w-full flex justify-center"><Embed url={url} /></div>
    }

    // Pdf
    if (type === "pdf") {
      let url = content[type].external.url;
      component = <div className="mb-4 w-full flex justify-center aspect-[8/11]"><Embed url={url} /></div>
    }

    // Video
    if (type === "video" && content[type].type === "external") {
      let url = content[type].external.url;
      component = <Video url={url} />
    }

    // Table
    if (type === "table") {
      let options = content[type];
      let data = content.children.map((row: any) => {
        let type = row.type;
        let cells = row[type].cells;
        return cells;
      });

      component = <Table data={data} options={options} />
    }
    
  }
  return component;
};

export const RichTextToReact = (contents: Array<any>, options: any = {}) => {
  if (!contents && !Array.isArray(contents)) return <></>;

  if (options.getRawContent && contents.length > 0) {
    let content = contents[0];
    return content.plain_text;
  }

  if (options.getFirstNode && contents.length > 0) {
    let content = contents[0];
    let type = content.type;
    let annotations = content?.plain_text ? content.annotations : {};
    return <Span annotations={annotations}>{content[type].content}</Span>;
  }

  return (
    <>
      {contents.map((content: any, index: number) => {
        let type = content.type;
        let annotations = content?.plain_text ? content.annotations : {};
        if (content[type].link)
          return (
            <Link
              target="_blank"
              href={content[type].link.url}
              key={index}
            >
              {nl2br(content[type].content)}
            </Link>
          );
        return (
          <Span key={index} annotations={annotations}>
            {nl2br(content[type].content)}
          </Span>
        );
      })}
    </>
  );
};

export default NotionRender;
