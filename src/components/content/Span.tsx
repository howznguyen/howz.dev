import React from "react";

interface SpanProps {
  children: React.ReactNode;
  annotations: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
    color?: string;
  };
}

const Span = ({ children, annotations }: SpanProps) => {
  let className = "";
  if (annotations.bold) className += "font-bold ";
  if (annotations.italic) className += "italic ";
  if (annotations.underline) className += "underline ";
  if (annotations.strikethrough) className += "line-through ";
  if (annotations.code)
    className += "bg-gray-100 dark:bg-gray-800 p-1 rounded ";
  if (annotations.color && annotations.color !== "default")
    className += `text-${annotations.color}-500 `;

  return <span className={className}>{children}</span>;
};

export default Span;
