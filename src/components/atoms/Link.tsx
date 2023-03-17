import Link from 'next/link'
import React from 'react'

interface LinkProps {
    children?: React.ReactNode
    href: string
    className?: string
    title?: string;
    target?: "_blank" | "_self" | "_parent" | "_top"
}

const LinkAtoms = ({ children, href, className, title, target }: LinkProps) => {
  const _target = target ?? "_self";
  const _className = className ?? "";
  return (
    <Link
        target={target}
        href={href}
        title={title}
        className={`${_className} text-blue-600 hover:underline dark:text-blue-300 ${_target === "_blank" ? "cursor-newtab" : ""}`}
    >
        {children}
    </Link>
  )
}

export default LinkAtoms