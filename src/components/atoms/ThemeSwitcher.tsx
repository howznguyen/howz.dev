"use client";

import { useTheme } from "next-themes";
import Button from "./Button";
import Icon from "./Icon";
import header from "@/datas/header";

interface ThemeSwitcherProps {}

const ThemeSwitcher = ({}: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={header.theme_switcher}
      className="!p-2"
    >
      {theme === "dark" ? <Icon icon="BiMoon" /> : <Icon icon="BiSun" />}
    </Button>
  );
};

export default ThemeSwitcher;
