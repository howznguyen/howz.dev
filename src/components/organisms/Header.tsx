import React, { useState } from "react";
import { Logo, ThemeSwitcher } from "@/components/atoms";
import { Navigation } from "@/components/molecules";

interface HeaderProps {
  settings?: any;
}

const Header = ({ settings }: HeaderProps) => {
  const [navigation, setNavigation] = useState([]);
  
  const siteName = settings?.site_name ?? "Howz.Dev";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
      <Logo title={siteName} />
      {/* <Navigation data={navigation} /> */}
      </div>
      
        
      <ThemeSwitcher />
    </div>
  );
};

export default Header;
