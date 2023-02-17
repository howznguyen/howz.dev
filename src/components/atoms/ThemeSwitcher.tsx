import { useTheme } from "next-themes";
import React from "react";
import { BiMoon, BiSun } from "react-icons/bi";

interface ThemeSwitcherProps {}

const ThemeSwitcher = ({}: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="text-gray-500 border border-slate-600 dark:border-slate-200 dark:text-gray-400 hover:border-green-600 dark:hover:border-green-600 hover:text-green-600 dark:hover:text-green-600 rounded-lg text-sm p-2.5 inline-flex items-center"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <BiMoon />  : <BiSun />}
    </button>
  );
};

export default ThemeSwitcher;
