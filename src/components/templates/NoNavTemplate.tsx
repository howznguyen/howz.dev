import React from "react";
import { Footer, Header } from "@/components/organisms";
import Head from "next/head";
import { NextSeo } from "next-seo";

interface NoNavTemplateProps {
  children ?: React.ReactNode;
}

const NoNavTemplate = ({ children }: NoNavTemplateProps) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/images/logo.png" />
        <meta name="author" content="Howz Nguyen" />
      </Head>
      {children}
    </>
  );
};
export default NoNavTemplate;
