import React from "react";
import { Footer, Header } from "@/components/organisms";
import Head from "next/head";
import { NextSeo } from "next-seo";

interface NoNavTemplateProps {
  children ?: React.ReactNode;
  head ?: any;
  options ?: any;
}

const NoNavTemplate = ({ children, head, options }: NoNavTemplateProps) => {
  let { settings, navigation, footer } = options ?? {};
  let siteName =  settings?.site_name ?? "Howz Nguyen Blog"; 
  let siteDescription = head?.description ?? settings?.site_description ?? "Howz Nguyen Blog is a blog about web development, programming, and technology.";
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
      {children}
    </>
  );
};
export default NoNavTemplate;
