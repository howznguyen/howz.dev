import { ReactNode, createElement } from "react";

interface HeadingProps {
  type?:
    | "heading_1"
    | "heading_2"
    | "heading_3"
  id?: string;
  children: ReactNode;
}

const Heading = ({ type, id, children }: HeadingProps) => {
  let sizes = {
    heading_1: "text-3xl mt-8",
    heading_2: "text-2xl mt-6",
    heading_3: "text-xl mt-4",
  };

  let _type = type ?? "heading_1";
  let size = sizes[_type];
  let HeadingComponent = _type.replace("heading_", "h");

  return (
    <>
      {createElement(
        HeadingComponent,
        { className: `${size} font-semibold dark:text-white my-2 scroll-mt-[70px]`, id: id },
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
