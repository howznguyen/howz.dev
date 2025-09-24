"use client";

import { Icon, LinkAtoms } from "../atoms";
import footer from "@/datas/footer";
import { SITE_CONFIG } from "@/lib/constants";

interface FooterProps {}

const Footer = ({}: FooterProps) => {
  return (
    <footer className="mt-4 pb-2">
      <main className="layout flex flex-col items-center border-t pt-6 dark:border-gray-600">
        <div className="flex flex-wrap justify-center gap-y-4 gap-x-8">
          {footer.links &&
            footer.links.map((item: any, i: number) => (
              <LinkAtoms target="_blank" key={i} href={item.link}>
                {item.title}
              </LinkAtoms>
            ))}
        </div>

        <p className="mt-12 font-medium text-gray-600 dark:text-gray-300">
          {footer.about_me}
        </p>

        <div className="mt-2 flex space-x-4">
          {footer.social_networks.map((item: any, i: number) => (
            <LinkAtoms href={item.link} title={item.title} key={i}>
              <Icon
                icon={item.icon}
                className="text-2xl text-gray-600 dark:text-gray-300"
              />
            </LinkAtoms>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} - {footer.build_with}
          <LinkAtoms href="https://nextjs.org/" target="_blank">
            Next.js
          </LinkAtoms>
          ,{" "}
          <LinkAtoms href="https://tailwindcss.com/" target="_blank">
            Tailwind CSS
          </LinkAtoms>
          ,{" "}
          <LinkAtoms href="https://notion.so/" target="_blank">
            Notion
          </LinkAtoms>
          . {footer.develop_by}
          <LinkAtoms href="https://github.com/howznguyen" target="_blank">
            @howznguyen
          </LinkAtoms>
          {footer.with} ❤️ .
        </p>
      </main>
    </footer>
  );
};

export default Footer;
