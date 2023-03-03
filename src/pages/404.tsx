import { PageNotFound } from '@/components/templates'
import { HeadMeta, Notion } from '@/lib'
import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import React from 'react'

interface Page404Pros {
  head: any;
}

const Page404 = ({head} : Page404Pros ) => {
  
  return (
    <>
    <NextSeo 
        title={head.siteTitle}
        description={head.siteDescription}
        canonical="https://howz.dev"
        openGraph={{
          title: head.siteTitle,
          description: head.siteDescription,
          images: [
            {
              url: head.ogImage,
              width: 800,
              height: 400,
              alt: head.siteTitle,
            },
          ],
        }}
      />
      <Head>
        <title>{head.siteTitle}</title>
      </Head>
      <PageNotFound/>
    </>

  )
}


export const getStaticProps : GetStaticProps = async (context) => {
  let options = await Notion.getNotionOptions();
  let headData = {
    title: "Không tìm thấy trang",
    description: "Không tìm thấy trang này",
  };

  let head = HeadMeta(options, headData);

  return {
      props: {
        head,
      },
  }
}

export default Page404