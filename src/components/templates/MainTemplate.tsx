import React from "react";
import { Footer, Header } from "@/components/organisms";
import Head from "next/head";
import { NextSeo } from "next-seo";

interface MainTemplateProps {
  children: React.ReactNode;
  head ?: any;
  options ?: any;
}

const MainTemplate = ({ children, head, options }: MainTemplateProps) => {
  let { settings, navigation, footer } = options ?? {};
  let siteName =  settings?.site_name ?? "Howz Nguyen Blog"; 
  let siteDescription = head?.description ?? settings?.site_description ?? "Howz Nguyen Blog is a blog about web development, programming, and technology.";
  let siteTitle = head?.title ? `${head.title} | ${siteName}` : siteName;
  let ogImage = head?.image ?? '/assets/images/og.png';

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
            <Header settings={settings} navigation={navigation} />
          </div>
      </div>
      {children}
      <Footer data={footer} />
    </>
  );
};
export default MainTemplate;
