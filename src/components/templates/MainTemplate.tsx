import React from "react";
import { Footer, Header } from "@/components/organisms";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { HeadMeta, Route } from "@/lib";

interface MainTemplateProps {
  children: React.ReactNode;
  head?: any;
  options ?: any;
}

const MainTemplate = ({ children, head, options }: MainTemplateProps) => {
  let { settings, navigation } = options ?? {};
  let headMeta = HeadMeta(options, head);

  return (
    <>
      <NextSeo 
          title={headMeta.siteTitle}
          description={headMeta.siteDescription}
          canonical={headMeta.url}
          openGraph={{
            title: headMeta.siteTitle,
            description: headMeta.siteDescription,
            images: [
              {
                url: headMeta.ogImage,
                width: 800,
                height: 400,
                alt: headMeta.siteTitle,
              },
            ],
          }}
      />
      <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{headMeta.siteTitle}</title>
          <link rel="icon" href={Route.defaultLogo(true)} />
          <meta name="author" content={headMeta.author} />
      </Head>
      <div className="w-full py-2 sticky top-0 z-50 transition-shadow shadow-sm bg-white dark:bg-dark mb-2">
          <div className="layout">
            <Header settings={settings} navigation={navigation} />
          </div>
      </div>
      {children}
      <Footer/>
    </>
  );
};
export default MainTemplate;
