import React from "react";
import { Footer, Header } from "@/components/organisms";
import Head from "next/head";
import { NextSeo } from "next-seo";

interface MainTemplateProps {
  children: React.ReactNode;
  options ?: any;
}

const MainTemplate = ({ children, options }: MainTemplateProps) => {
  let { settings, navigation, footer } = options ?? {};

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/images/logo.png" />
        <meta name="author" content="Howz Nguyen" />
      </Head>
      <div className="w-full py-2 sticky top-0 z-50 transition-shadow shadow-sm bg-white dark:bg-dark mb-2">
          <div className="layout">
            <Header settings={settings} navigation={navigation} />
          </div>
      </div>
      {children}
      <Footer data={footer} />
    </>
  );
};
export default MainTemplate;
