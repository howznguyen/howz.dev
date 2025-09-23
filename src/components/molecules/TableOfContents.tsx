"use client";

import postData from "@/datas/post";
import { useState, useEffect, useMemo } from "react";
import type { NotionHeading } from "@/services/notion/render.service";

interface TableOfContentsProps {
  data: NotionHeading[];
}

const TableOfContents = ({ data }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");
  const headings = useMemo(() => data || [], [data]);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings
        .map((heading: NotionHeading) => document.getElementById(heading.id))
        .filter(Boolean);

      const scrollPosition = window.scrollY + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(element.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  if (headings.length === 0) return <></>;

  return (
    <aside className="hidden md:block md:sticky md:top-20 w-full h-fit p-4 rounded-lg bg-slate-100 text-black dark:bg-slate-800 dark:text-white">
      <span className="text-lg font-semibold">
        {postData.table_of_contents}
      </span>
      <nav className="my-2 w-full max-h-[calc(100vh-9rem-200px)] overflow-auto transition-all text-slate-500 dark:text-slate-500">
        <ul>
          {headings.map((heading: NotionHeading, i: number) => (
            <li key={i}>
              <a
                href={`#${heading.id}`}
                className={`cursor-pointer text-sm focus:outline-none p-1 w-full flex font-semibold dark:hover:text-white hover:text-black text-blue-600 dark:text-blue-300 ${
                  heading.level === 2 ? "pl-4" : ""
                } ${
                  activeId === heading.id
                    ? "font-bold text-black dark:text-white"
                    : ""
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default TableOfContents;
