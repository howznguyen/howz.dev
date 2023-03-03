import React from "react";

interface OrderedListProps {
    children: React.ReactNode;
    number ?: number;
}

const OrderedList = ({ children , number } : OrderedListProps) => {
  
  number = number ?? 1;
  return (<ol start={number} className="space-y-1 font-medium text-gray-800 list-decimal list-inside dark:text-gray-400">
                {children}
          </ol>)
}

export default OrderedList

