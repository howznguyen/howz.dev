import React from "react";

interface HeadingProps {
  type?:
    | "heading_1"
    | "heading_2"
    | "heading_3"
  id?: string;
  children: React.ReactNode;
}

const Heading = ({ type, id, children }: HeadingProps) => {
  let sizes = {
    heading_1: "text-2xl",
    heading_2: "text-xl",
    heading_3: "text-lg",
  };

  let _type = type ?? "heading_1";
  let size = sizes[_type];
  let HeadingComponent = _type.replace("heading_", "h");

  return (
    <>
      {React.createElement(
        HeadingComponent,
        { className: `${size} font-medium dark:text-white my-2 scroll-mt-[70px]`, id: id },
        children
      )}
    </>
  );
};

export const HeadingTypes = [
  "heading_1",
  "heading_2",
  "heading_3",
];
export default Heading;
