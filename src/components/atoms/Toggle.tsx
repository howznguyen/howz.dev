import { ReactNode, useState } from "react";

interface ToggleProps {
  title: ReactNode;
  children: ReactNode;
}

const Toggle = ({ title, children }: ToggleProps) => {
  const [isShow, setShow] = useState(false);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-start">
        <button
          className={`text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center`}
          onClick={() => setShow(!isShow)}
        >
          <svg
            className={`${
              isShow ? "rotate-90" : ""
            } transition-all duration-100 w-4 h-4`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        <span className="ml-2 text-lg font-bold text-gray-800 dark:text-gray-100">
          {title}
        </span>
      </div>
      <div
        className={`pl-10 mt-2 transition-all duration-100 ${
          isShow ? "max-h-[100000px]" : "max-h-0"
        } overflow-hidden`}
      >
        {children}
      </div>
    </div>
  );
};

export default Toggle;
