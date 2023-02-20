import { Button, ThemeSwitcher } from '@/components/atoms';
import { NoNavTemplate } from '@/components/templates'
import { Route } from '@/lib';
import Link from 'next/link';
import React from 'react'

interface PageNotFoundPros {
    options?: any;
}

const PageNotFound = ({options} : PageNotFoundPros ) => {
    let head = {
        title: "Page Not Found",
        description: "Page Not Found",
    };
    
  return (
    <NoNavTemplate head={head} options={options}>
        <section className="flex items-center h-screen">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
                        <span className="sr-only">Error</span>404
                    </h2>
                    <p className="text-2xl font-semibold md:text-3xl">
                        {"Sorry, we couldn't find this page."}
                    </p>
                    <p className="mt-4 mb-8 dark:text-gray-400">
                        But dont worry, you can find plenty of other things on our homepage.
                    </p>
                    <div className="flex gap-x-4 justify-center">
                        <Button >
                            <Link href={Route.index()}>Back to Home</Link>
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