import { PageNotFound } from '@/components/templates'
import { Notion } from '@/lib'
import { GetStaticProps } from 'next'
import React from 'react'

interface Page404Pros {
  options: any;
}

const Page404 = ({options} : Page404Pros ) => {

  return (
    <PageNotFound options={options}/>
  )
}


export const getStaticProps : GetStaticProps = async (context) => {
  let options = await Notion.getNotionOptions();

  return {
      props: {
          options: options
      },
  }
}

export default Page404