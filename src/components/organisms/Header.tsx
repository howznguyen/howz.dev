import React, { useState } from "react";
import { LangugeSwither, Logo, ThemeSwitcher } from "@/components/atoms";
import { Navigation } from "@/components/molecules";

interface HeaderProps {
  settings?: any;
  navigation?: any;
}

const Header = ({ settings, navigation }: HeaderProps) => {
  
  const siteName = settings?.site_name ?? "Howz Nguyen Blog";

  return (
    <div className="flex items-center justify-between">
      
      <Logo title={siteName} />
      
      
      <div className="flex items-center">
        <Navigation navigation={navigation} />
        <div className="hidden md:flex items-center gap-x-2">
          |
          <LangugeSwither />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Header;
