"use client";

import { Fragment, ReactNode } from "react";
import { NotionRichTextData as RichTextType } from "@/services/notion/render.service";
import Link from "next/link";
import { LinkAtoms } from "@/components/atoms";

interface RichTextProps {
  richText: RichTextType[];
}

export const RichText = ({ richText }: RichTextProps) => {
  if (!richText || richText.length === 0) return null;

  return (
    <>
      {richText.map((text, index) => {
        let content: ReactNode = text.content;
        const annotations = text.annotations || {};

        // Apply formatting based on annotations - inline styles
        let className = "";
        if (annotations.bold) className += "font-bold ";
        if (annotations.italic) className += "italic ";
        if (annotations.underline) className += "underline ";
        if (annotations.strikethrough) className += "line-through ";
        if (annotations.code)
          className +=
            "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono ";

        // Apply color
        if (annotations.color && annotations.color !== "default") {
          const colorClasses = {
            gray: "text-gray-600 dark:text-gray-400",
            brown: "text-amber-700 dark:text-amber-300",
            orange: "text-orange-600 dark:text-orange-400",
            yellow: "text-yellow-600 dark:text-yellow-400",
            green: "text-green-600 dark:text-green-400",
            blue: "text-blue-600 dark:text-blue-400",
            purple: "text-purple-600 dark:text-purple-400",
            pink: "text-pink-600 dark:text-pink-400",
            red: "text-red-600 dark:text-red-400",
          };
          className +=
            colorClasses[annotations.color as keyof typeof colorClasses] || "";
        }

        // Wrap with span for styling
        content = (
          <span key={`span-${index}`} className={className.trim()}>
            {content}
          </span>
        );

        // Apply link
        if (text.link) {
          const isExternal = text.link.startsWith("http");
          content = isExternal ? (
            <LinkAtoms
              key={`link-${index}`}
              href={text.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {content}
            </LinkAtoms>
          ) : (
            <LinkAtoms
              key={`link-${index}`}
              href={text.link}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {content}
            </LinkAtoms>
          );
        }

        return <Fragment key={index}>{content}</Fragment>;
      })}
    </>
  );
};
