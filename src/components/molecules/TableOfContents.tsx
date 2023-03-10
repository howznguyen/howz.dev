import React from "react";
import { NotionToHeading } from "@/components/molecules/NotionRender";
import Scrollspy from "react-scrollspy";

interface TableOfContentsProps {
  data: any;
}

const TableOfContents = ({ data }: TableOfContentsProps) => {
  let headings = NotionToHeading(data);
  if (headings.length === 0) return <></>;
  return (
    <aside className="hidden md:block md:sticky md:top-20 w-full h-fit p-4 rounded-lg bg-slate-100 text-black dark:bg-slate-800 dark:text-white">
      <h3 className="text-lg font-semibold">Mục Lục</h3>
      <nav className="my-2 w-full max-h-[calc(100vh-9rem-200px)] overflow-auto transition-all text-slate-500 dark:text-slate-500">
        <Scrollspy items={headings.map((heading: any) => heading.id)} currentClassName="text-black dark:text-white">
          {headings.map((heading: any, i: number) => (
            <a
              key={i}
              href={`#${heading.id}`}
              className={`cursor-pointer text-sm focus:outline-none p-1 w-full flex font-semibold  dark:hover:text-white hover:text-black ${heading.type === "heading_2" ? "pl-4" : ""}`}
            >
              {heading.text}
            </a>
          ))}
        </Scrollspy>
      </nav>
    </aside>
  );
};

export default TableOfContents;
