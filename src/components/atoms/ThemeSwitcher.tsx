import { useTheme } from "next-themes";
import React from "react";
import Button from "./Button";
import Icon from "./Icon";
import { useTrans } from "@/lib";


interface ThemeSwitcherProps {}

const ThemeSwitcher = ({}: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();
  const trans = useTrans();
  
  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={ trans.header.theme_switcher }
    >
      {theme === "dark" ? <Icon icon="BiMoon" />  : <Icon icon="BiSun" />}
    </Button>
  );
};

export default ThemeSwitcher;
