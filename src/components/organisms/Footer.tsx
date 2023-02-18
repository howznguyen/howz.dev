import React from 'react'
import { Link } from '../atoms'

interface FooterProps {
    children?: React.ReactNode
}


const Footer = ({ children }: FooterProps) => {
  return (
    <footer className="mt-4 pb-2">
      <main className="layout flex flex-col items-center border-t pt-6 dark:border-gray-600">
        <div className="flex flex-wrap justify-center gap-y-4 gap-x-8">
          {children}
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} - Built with{" "}
          <Link href="https://nextjs.org/" target="_blank" >
            Next.js
          </Link>
          ,{" "}
          <Link
            href="https://tailwindcss.com/"
            target="_blank"
          >
            Tailwind CSS
          </Link>
          ,{" "}
          <Link
            href="https://notion.so/"
            target="_blank"
          >
            Notion
          </Link>
          . Developed by{" "}
          <Link
            href="#"
            target="_blank"
          >
            @howznguyen
          </Link>
          .
        </p>
      </main>
    </footer>
  )
}

export default Footer