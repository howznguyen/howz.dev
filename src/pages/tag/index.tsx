import { Image ,Tag } from '@/components/atoms';
import { MainTemplate } from '@/components/templates'
import { Notion, Route, useTrans } from '@/lib'
import { GetStaticProps } from 'next'
import React from 'react'

interface TagPageProps {
  tags: any;
  head: any;
  options: any;
}

const TagPage = ({tags, head, options} : TagPageProps) => {
  const trans = useTrans();

  return (
    <MainTemplate options={options} head={head}>
        <div className="layout py-12">
          <h1 className="text-3xl md:text-5xl font-semibold">{ trans.tag.tags }</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            { trans.tag.intro }
          </p>
          <div className="mt-10 flex items-center justify-start flex-wrap gap-y-2 w-full">
              {tags.map((tag: any, index: number) => <Tag key={index} name={tag} />)}
          </div>

          <div className="mt-10">
            <Image src={Route.image('image-1.png')} alt={head.description}/>
          </div>
        </div>
    </MainTemplate>
  )
 
}

export const getStaticProps: GetStaticProps = async (context) => {
    let tags = await Notion.getTags();
    let options = await Notion.getNotionOptions();

    let head = {
      url: Route.tag.index(true),
      title: "Tags",
      description: "Tags",
    };

    return {
      props: {
        tags: tags,
        head: head,
        options: options,
      },
      revalidate: 10,
    }
}

export default TagPage