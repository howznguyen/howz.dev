import Link from 'next/link'
import React from 'react'

interface LinkProps {
    children?: React.ReactNode
    href: string
    className?: string
    target?: "_blank" | "_self" | "_parent" | "_top"
}

const LinkAtoms = ({ children, href, className, target }: LinkProps) => {
  let _target = target ?? "_self";
  return (
    <Link
        target={target}
        href={href}
        className={`${className} text-blue-500 hover:underline dark:text-blue-400 ${_target === "_blank" ? "cursor-newtab" : ""}`}
    >
        {children}
    </Link>
  )
}

export default LinkAtoms