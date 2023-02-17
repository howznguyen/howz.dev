import React from "react";

interface ParagraphProps {
  children: React.ReactNode;
}

const Paragraph = ({ children }: ParagraphProps) => {
  return (
    <div className="font-medium text-gray-800 dark:text-gray-400 mb-4">
      {children}
    </div>
  );
};

export default Paragraph;
