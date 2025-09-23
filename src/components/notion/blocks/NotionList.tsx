"use client";

import { ReactNode } from "react";

interface NotionListProps {
  children: ReactNode;
  ordered?: boolean;
  number?: number;
}

export const NotionList = ({ children, ordered = false, number }: NotionListProps) => {
  if (ordered) {
    return (
      <ol
        start={number ?? 1}
        className="space-y-1 font-medium text-gray-800 list-decimal list-inside dark:text-gray-400"
      >
        {children}
      </ol>
    );
  }

  return (
    <ul className="space-y-1 font-medium text-gray-800 list-disc list-inside dark:text-gray-400">
      {children}
    </ul>
  );
};