import { ReactNode } from "react";

interface BlockquoteProps {
  children: ReactNode;
}

const Blockquote = ({ children }: BlockquoteProps) => {
  return (
    <blockquote className="p-4 my-4 border-l-[0.25rem] border-blockquote bg-gray-50 dark:bg-gray-800">
      {children}
    </blockquote>
  );
};

export default Blockquote;
