import { ReactNode } from "react";

interface UnorderedListProps {
    children: ReactNode;
}

const UnorderedList = ({ children } : UnorderedListProps) => {
  
  return (<ul className="space-y-1 font-medium text-gray-800 list-disc list-inside dark:text-gray-400">
            {children}
          </ul>)
}

export default UnorderedList

