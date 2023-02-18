import React from "react";

interface CalloutProps {
  emoji: string;
  children: React.ReactNode;
}

const Callout = ({ emoji, children }: CalloutProps) => {
  return (
    <div className="p-4 mb-4 flex items-center border-gray-300 bg-gray-100 rounded-lg dark:border-gray-500 dark:bg-gray-800">
      <span className="text-2xl mr-1 text-gray-500 dark:text-gray-400">
        {emoji ?? "💡"}
      </span>
      <span className="text-xl text-gray-900 dark:text-white">{children}</span>
    </div>
  );
};

export default Callout;
