"use client";

import Link from "next/link";
import { ReactNode } from "react";

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
  const _target = target ?? "_self";
  const _className = className ?? "";
  const _href = href ?? "#";
  return (
    <Link
      target={target}
      rel={rel}
      href={_href}
      title={title}
      className={`${_className} text-blue-600 hover:underline dark:text-blue-300 ${
        _target === "_blank" ? "cursor-newtab" : ""
      }`}
    >
      {children}
    </Link>
  );
};

export default LinkAtoms;
