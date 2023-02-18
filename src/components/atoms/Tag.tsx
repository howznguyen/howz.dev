import { Route } from "@/lib";
import React from "react";

interface TagProps {
  name: string;
  color?: string;
}

const Tag = ({ name, color }: TagProps) => {
  let colors = {
    "light-gray": "bg-gray-700 dark:bg-gray-700",
    gray: "bg-gray-500 dark:bg-gray-200",
    brown: "bg-brown-500 dark:bg-brown-200",
    orange: "bg-orange-500 dark:bg-orange-200",
    yellow: "bg-yellow-500 dark:bg-yellow-200",
    green: "bg-green-500 dark:bg-green-200",
    blue: "bg-blue-500 dark:bg-blue-200",
    purple: "bg-purple-500 dark:bg-purple-200",
    pink: "bg-pink-500 dark:bg-pink-200",
    red: "bg-red-500 dark:bg-red-200",
    default: "bg-gray-700 dark:bg-gray-200",
  };

  let index = color ?? "";

  let _color = colors[index] ?? colors["default"];

  return (
    <a
      className={`inline-block px-2 py-1 mr-2 text-base font-semibold rounded-full text-white dark:text-black ${_color}`}
      href={Route.tag(name)}
    >
      {name}
    </a>
  );
};

export default Tag;
