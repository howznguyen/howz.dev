"use client";

import React, { useState } from "react";
import cn from "classnames";

interface BlockToggleProps {
  className?: string;
  text: React.ReactNode;
  color?: string;
  updatedBlock?: React.ReactNode;
  children?: React.ReactNode;
}

export const BlockToggle: React.FC<BlockToggleProps> = ({
  className,
  text,
  color,
  updatedBlock,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("mb-4 w-full max-w-none", className)}>
      {updatedBlock}
      <div
        className="flex items-center justify-start cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className={cn(
            "w-4 h-4 mr-2 text-gray-500 dark:text-gray-400 transition-transform duration-100",
            isOpen && "rotate-90"
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
        <div className={cn("text-lg font-bold text-gray-800 dark:text-gray-100", color && `notion-${color}`)}>
          {text}
        </div>
      </div>
      <div
        className={cn(
          "pl-6 mt-2 transition-all duration-100 overflow-hidden w-full max-w-none",
          isOpen ? "max-h-[100000px]" : "max-h-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};