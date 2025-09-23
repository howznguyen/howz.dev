"use client";

import { ReactNode, createElement } from "react";

interface NotionHeadingProps {
  type?: "heading_1" | "heading_2" | "heading_3";
  id?: string;
  children: ReactNode;
}

export const NotionHeading = ({ type, id, children }: NotionHeadingProps) => {
  const sizes = {
    heading_1: "text-3xl mt-8",
    heading_2: "text-2xl mt-6",
    heading_3: "text-xl mt-4",
  };

  const _type = type ?? "heading_1";
  const size = sizes[_type];
  const HeadingComponent = _type.replace("heading_", "h") as keyof JSX.IntrinsicElements;

  return createElement(
    HeadingComponent,
    {
      className: `${size} font-semibold dark:text-white my-2 scroll-mt-[70px]`,
      id: id,
    },
    children
  );
};