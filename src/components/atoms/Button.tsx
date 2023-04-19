import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  removeClassName?: string[],
  title?: string;
  onClick?: () => void;
}

const Button = ({ children, type, className,removeClassName, title, onClick }: ButtonProps) => {
  const _type = type || "button";
  const _onClick = onClick || (() => {});
  const _className = className ?? "";
  const _removeClassName = removeClassName ?? [];
  let _classNames = [
    "text-gray-500",
    "border",
    "border-gray-300",
    "dark:border-slate-600",
    "dark:text-gray-400",
    "hover:border-blue-600",
    "dark:hover:border-blue-600",
    "hover:text-blue-600", 
    "dark:hover:text-blue-600",
    "rounded",
    "text-sm",
    "p-2.5",
    "inline-flex",
    "items-center"
  ];
  _classNames = _classNames.filter((x) => !_removeClassName.includes(x))


  return (
    <button
      type={_type}
      className={`${_className} ${_classNames.join(" ")}`}
      onClick={_onClick}
      title={title}
    >
      {children}
    </button>
  );
};

export default Button;
