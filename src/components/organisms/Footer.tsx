import React from 'react'
import { Link } from '../atoms'
import { SiFacebook, SiGithub, SiGitlab, SiGmail, SiLinkedin } from "react-icons/si";

interface FooterProps {
  data?: Array<any>
}


const Footer = ({ data }: FooterProps) => {
  return (
    <footer className="mt-4 pb-2">
      <main className="layout flex flex-col items-center border-t pt-6 dark:border-gray-600">
        <div className="flex flex-wrap justify-center gap-y-4 gap-x-8">
            {data && data.map((link, index) => (
              <Link
                target="_blank"
                key={index}
                href={link.url}
                >
                {link.title}
              </Link>
            ))}
        </div>

        <p className="mt-12 font-medium text-gray-600 dark:text-gray-300">Tìm hiểu về mình</p>

        <div className="mt-2 flex space-x-4">
          <Link href='mailto:duyntp2000@gmail.com'>
              <SiGmail className="text-2xl text-gray-600 dark:text-gray-300" />
          </Link>
          <Link target='_blank' href='https://www.linkedin.com/in/duyntp2000/'>
             <SiLinkedin className="text-2xl text-gray-600 dark:text-gray-300" />
          </Link>
          <Link target='_blank' href='https://github.com/howznguyen'>
              <SiGithub className="text-2xl text-gray-600 dark:text-gray-300" />
          </Link>
          <Link target='_blank' href='https://gitlab.com/howznguyen'>
            <SiGitlab className="text-2xl text-gray-600 dark:text-gray-300" />
          </Link>
          <Link target='_blank' href='https://www.facebook.com/howznguyen'>
            <SiFacebook className="text-2xl text-gray-600 dark:text-gray-300" />
          </Link>

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
            href="https://github.com/howznguyen"
            target="_blank"
          >
            @howznguyen
          </Link>
          {" "}
          with ❤️
          .
        </p>
      </main>
    </footer>
  )
}

export default Footer