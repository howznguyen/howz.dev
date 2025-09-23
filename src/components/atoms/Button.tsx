"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  removeClassName?: string[];
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

const Button = ({
  children,
  type = "button",
  variant = "secondary",
  size = "md",
  className = "",
  removeClassName = [],
  title,
  disabled = false,
  loading = false,
  onClick,
}: ButtonProps) => {
  const baseClasses = [
    "inline-flex",
    "items-center",
    "justify-center",
    "font-medium",
    "rounded",
    "transition-colors",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
  ];

  const variantClasses = {
    primary: [
      "bg-blue-600",
      "hover:bg-blue-700",
      "text-white",
      "border-transparent",
      "focus:ring-blue-500",
    ],
    secondary: [
      "text-gray-500",
      "border",
      "border-gray-300",
      "dark:border-slate-600",
      "dark:text-gray-400",
      "hover:border-blue-600",
      "dark:hover:border-blue-600",
      "hover:text-blue-600",
      "dark:hover:text-blue-600",
      "bg-white",
      "dark:bg-gray-800",
      "focus:ring-gray-500",
    ],
    ghost: [
      "text-gray-500",
      "dark:text-gray-400",
      "hover:text-blue-600",
      "dark:hover:text-blue-600",
      "hover:bg-gray-100",
      "dark:hover:bg-gray-700",
      "focus:ring-gray-500",
    ],
    danger: [
      "bg-red-600",
      "hover:bg-red-700",
      "text-white",
      "border-transparent",
      "focus:ring-red-500",
    ],
  };

  const sizeClasses = {
    sm: ["text-sm", "px-3", "py-1.5"],
    md: ["text-sm", "px-4", "py-2"],
    lg: ["text-base", "px-6", "py-3"],
  };

  let finalClasses = [
    ...baseClasses,
    ...variantClasses[variant],
    ...sizeClasses[size],
  ];

  // Remove specified classes
  finalClasses = finalClasses.filter((cls) => !removeClassName.includes(cls));

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={`${finalClasses.join(" ")} ${className}`}
      onClick={handleClick}
      title={title}
      disabled={disabled || loading}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
