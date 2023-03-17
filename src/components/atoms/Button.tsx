import React from "react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  title?: string;
  onClick?: () => void;
}

const Button = ({ children, type, className, title, onClick }: ButtonProps) => {
  const _type = type || "button";
  const _onClick = onClick || (() => {});
  const _className = className ?? "";

  return (
    <button
      type={_type}
      className={`${_className} text-gray-500 border border-gray-300 dark:border-slate-600 dark:text-gray-400 hover:border-blue-600 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-600 rounded text-sm p-2.5 inline-flex items-center`}
      onClick={_onClick}
      title={title}
    >
      {children}
    </button>
  );
};

export default Button;
