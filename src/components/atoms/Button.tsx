import React from "react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
}

const Button = ({ children, type, className, onClick }: ButtonProps) => {
  const _type = type || "button";
  const _onClick = onClick || (() => {});

  return (
    <button
      type={_type}
      className={`${className} text-gray-500 border border-slate-600 dark:border-slate-200 dark:text-gray-400 hover:border-green-600 dark:hover:border-green-600 hover:text-green-600 dark:hover:text-green-600 rounded-lg text-sm p-2.5 inline-flex items-center`}
      onClick={_onClick}
    >
      {children}
    </button>
  );
};

export default Button;
