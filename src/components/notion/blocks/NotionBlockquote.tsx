"use client";

import { ReactNode } from "react";

interface NotionBlockquoteProps {
  children: ReactNode;
}

export const NotionBlockquote = ({ children }: NotionBlockquoteProps) => {
  return (
    <blockquote className="p-4 my-4 border-l-[0.25rem] border-blockquote bg-gray-50 dark:bg-gray-800">
      {children}
    </blockquote>
  );
};