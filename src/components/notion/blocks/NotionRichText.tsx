"use client";

import React from "react";
import type { Decoration } from "notion-types";
import { LinkAtoms } from "@/components/atoms";
import cn from "classnames";

interface RichTextProps {
  richText?: any[];
}

interface TextProps {
  value: Decoration[];
  block?: any;
  linkProps?: any;
  linkProtocol?: string;
}

export const NotionRichText: React.FC<TextProps> = ({
  value,
  block,
  linkProps,
  linkProtocol,
}) => {
  if (!value) {
    console.log("NotionRichText: value is null/undefined");
    return null;
  }

  return (
    <span className="">
      {value?.map(([text, decorations], index) => {
        if (!decorations) {
          return <React.Fragment key={index}>{text}</React.Fragment>;
        }

        return decorations.reduceRight((element, decorator) => {
          const [decoratorType, decoratorValue] = decorator;

          switch (decoratorType) {
            case "b":
            case "i":
            case "s":
            case "c": {
              let className = "";
              if (decoratorType === "b") className += "font-bold ";
              if (decoratorType === "i") className += "italic ";
              if (decoratorType === "s") className += "line-through ";
              if (decoratorType === "c")
                className +=
                  "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono ";

              // Wrap with span for styling
              return (
                <span key={index} className={cn(className.trim())}>
                  {element}
                </span>
              );
            }
            case "a":
              const isExternal = decoratorValue.toString().startsWith("http");
              return isExternal ? (
                <LinkAtoms
                  key={index}
                  href={decoratorValue}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {element}
                </LinkAtoms>
              ) : (
                <LinkAtoms
                  key={index}
                  href={decoratorValue}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {element}
                </LinkAtoms>
              );
            case "u":
              return (
                <span key={index} className="underline">
                  {element}
                </span>
              );
            case "h":
              return (
                <mark key={index} className="bg-yellow-200 dark:bg-yellow-800">
                  {element}
                </mark>
              );
            default:
              return <React.Fragment key={index}>{element}</React.Fragment>;
          }
        }, <React.Fragment key={index}>{text}</React.Fragment>);
      })}
    </span>
  );
};

export const RichText: React.FC<RichTextProps> = ({ richText }) => {
  if (!richText || richText.length === 0) return null;

  return (
    <span>
      {richText
        .map((item, index) =>
          typeof item === "string" ? item : item?.content || ""
        )
        .join("")}
    </span>
  );
};
