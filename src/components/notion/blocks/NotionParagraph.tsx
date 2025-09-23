"use client";

import { ReactNode } from "react";

interface NotionParagraphProps {
  children: ReactNode;
}

export const NotionParagraph = ({ children }: NotionParagraphProps) => {
  return (
    <div className="font-medium text-gray-800 dark:text-gray-400 mb-4">
      {children}
    </div>
  );
};