import { useTheme } from "next-themes";
import React from "react";
import { BiMoon, BiSun } from "react-icons/bi";
import Button from "./Button";

interface ThemeSwitcherProps {}

const ThemeSwitcher = ({}: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <BiMoon />  : <BiSun />}
    </Button>
  );
};

export default ThemeSwitcher;
