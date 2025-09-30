"use client";

import Link from "next/link";
import { ReactNode } from "react";
import cn from "classnames";

interface LinkProps {
  children?: ReactNode;
  href?: string;
  className?: string;
  title?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

const LinkAtoms = ({
  children,
  href,
  className,
  title,
  target,
  rel,
}: LinkProps) => {
  const defaultClassName =
    "text-blue-600 dark:text-blue-300 relative inline-block no-underline after:absolute after:w-0 after:h-0.5 after:bg-current after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full";
  const _target = target ?? "_self";
  const _className = className ?? "";
  const _href = href ?? "#";
  return (
    <Link
      target={target}
      rel={rel}
      href={_href}
      title={title}
      className={cn(defaultClassName, _className, {
        "cursor-newtab": _target === "_blank",
      })}
    >
      {children}
    </Link>
  );
};

export default LinkAtoms;
