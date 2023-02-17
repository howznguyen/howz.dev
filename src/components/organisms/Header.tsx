import React, { useState } from "react";
import { Logo, ThemeSwitcher } from "@/components/atoms";
import { Navigation } from "@/components/molecules";

interface HeaderProps {
  settings?: any;
  navigation?: any;
}

const Header = ({ settings, navigation }: HeaderProps) => {
  
  const siteName = settings?.site_name ?? "Howz.Dev";

  return (
    <div className="flex items-center justify-between">
      
      <Logo title={siteName} />
      
      
      <div className="flex items-center">
        <Navigation navigation={navigation} />
        <div className="hidden md:block">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Header;
