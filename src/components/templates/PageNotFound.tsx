import { Button, ThemeSwitcher } from '@/components/atoms';
import { NoNavTemplate } from '@/components/templates'
import { Route, useTrans } from '@/lib';
import Link from 'next/link';

interface PageNotFoundPros {
}

const PageNotFound = ({} : PageNotFoundPros ) => {
  const trans = useTrans()
  let head = {
    site: trans.error_page[404].title,
  }


  return (
    <NoNavTemplate head={head}>
        <section className="flex items-center h-screen">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
                        <span className="sr-only">{trans.common.error}</span>404
                    </h2>
                    <p className="text-2xl font-semibold md:text-3xl">
                        {trans.error_page[404].head}
                    </p>
                    <p className="mt-4 mb-8 dark:text-gray-400">
                        {trans.error_page[404].desc}
                    </p>
                    <div className="flex gap-x-4 justify-center">
                        <Button >
                            <Link href={Route.index()}>{trans.error_page[404].home_button}</Link>
                        </Button>
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </section>
    </NoNavTemplate>
  )
}

export default PageNotFound