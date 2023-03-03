import React from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { HeadMeta, Route } from "@/lib";

interface NoNavTemplateProps {
  children: React.ReactNode;
  head?: any;
  options ?: any;
}

const NoNavTemplate = ({ children, head, options }: NoNavTemplateProps) => {
  let headMeta = HeadMeta(options, head);

  return (
    <>
      <NextSeo 
            title={headMeta.siteTitle}
            description={headMeta.siteDescription}
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

      {children}
    </>
  );
};

export default NoNavTemplate;
