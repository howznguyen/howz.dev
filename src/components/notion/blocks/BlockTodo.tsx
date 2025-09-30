"use client";

import React from "react";
import type { Block } from "notion-types";
import { BlockRichText } from "./BlockRichText";

interface BlockTodoProps {
  block: Block;
  children?: React.ReactNode;
  className?: string;
}

export const BlockTodo: React.FC<BlockTodoProps> = ({
  block,
  children,
  className,
}) => {
  const isChecked = block.properties?.checked?.[0]?.[0] === "Yes";
  const todoId = `todo-${block.id}`;

  return (
    <div className={`${className} flex items-start mb-4`}>
      <input
        readOnly
        id={todoId}
        type="checkbox"
        checked={isChecked}
        className="w-4 h-4 rounded-sm mt-1 mr-2 bg-gray-200 border-gray-300 disabled:bg-blue-400 disabled:border-blue-400 disabled:text-blue-600 dark:bg-gray-600 dark:border-gray-500 "
      />
      <label
        htmlFor={todoId}
        className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100"
      >
        {block.properties?.title && (
          <BlockRichText value={block.properties.title} block={block} />
        )}
        {children}
      </label>
    </div>
  );
};
