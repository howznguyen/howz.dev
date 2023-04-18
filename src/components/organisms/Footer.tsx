import React from 'react'
import { Icon, Link } from '../atoms'
import { useTrans } from '@/lib';

interface FooterProps {}

const Footer = ({}: FooterProps) => {
  const trans = useTrans();
  
  return (
    <footer className="mt-4 pb-2">
      <main className="layout flex flex-col items-center border-t pt-6 dark:border-gray-600">
        <div className="flex flex-wrap justify-center gap-y-4 gap-x-8">
            {trans.footer.links && trans.footer.links.map((item: any, i: number) => (
              <Link
                target="_blank"
                key={i}
                href={item.link}
                >
                {item.title}
              </Link>
            ))}
        </div>

        <p className="mt-12 font-medium text-gray-600 dark:text-gray-300">{ trans.footer.about_me }</p>

        <div className="mt-2 flex space-x-4">
          {trans.footer.social_networks.map((item: any, i: number) => 
            <Link href={item.link} title={item.title} key={i}>
              <Icon icon={item.icon} className="text-2xl text-gray-600 dark:text-gray-300"/>
            </Link>
          )}

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