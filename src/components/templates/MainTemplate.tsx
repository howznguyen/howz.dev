import React from "react";
import { Header } from "@/components/organisms";
import Head from "next/head";
import { NextSeo } from "next-seo";

interface MainTemplateProps {
  children: React.ReactNode;
  head ?: any;
  settings ?: any;
}

const MainTemplate = ({ children, head, settings }: MainTemplateProps) => {
  let siteName =  settings?.site_name ?? "Howz.Dev"; 
  let siteDescription = head?.description ?? settings?.site_description ?? "Howz.Dev is a blog about web development, programming, and technology.";
  let siteTitle = head?.title ? `${head.title} | ${siteName}` : siteName;
  let ogImage = `/api/og?title=${head?.title}&description=${head?.description}`;

  return (
    <>
      <NextSeo 
        title={siteTitle}
        description={siteDescription}
        canonical="https://howz.dev"
        openGraph={{
          title: siteTitle,
          description: siteDescription,
          images: [
            {
              url: ogImage,
              width: 800,
              height: 400,
              alt: siteTitle,
            },
          ],
        }}
      />
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{siteTitle}</title>
        <link rel="icon" href="/assets/images/logo.png" />
        <meta name="author" content="Howz Nguyen" />
      </Head>
      <div className="w-full py-2 sticky top-0 z-50 transition-shadow shadow-sm bg-white dark:bg-dark mb-2">
          <div className="layout">
            <Header settings={settings} />
          </div>
      </div>
      {children}
    </>
  );
};
export default MainTemplate;
