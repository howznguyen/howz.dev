"use client";

import React from "react";
import { Footer, Header } from "@/components/organisms";
import Head from "next/head";
import { HeadMeta, Route } from "@/lib";

interface MainTemplateProps {
  children: React.ReactNode;
  options?: any;
}

const MainTemplate = ({ children, options }: MainTemplateProps) => {
  let { settings, navigation } = options ?? {};

  return (
    <>
      <div className="w-full py-2 sticky top-0 z-50 transition-shadow shadow-sm bg-white dark:bg-dark mb-2">
        <div className="layout">
          <Header settings={settings} navigation={navigation} />
        </div>
      </div>
      {children}
      <Footer />
    </>
  );
};
export default MainTemplate;
