import { Button, ThemeSwitcher } from '@/components/atoms';
import { NoNavTemplate } from '@/components/templates'
import { Route } from '@/lib';
import Link from 'next/link';
import React from 'react'

interface PageNotFoundPros {
}

const PageNotFound = ({} : PageNotFoundPros ) => {
  let head = {
    site: "Page Not Found",
  }


  return (
    <NoNavTemplate head={head}>
        <section className="flex items-center h-screen">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
                        <span className="sr-only">Error</span>404
                    </h2>
                    <p className="text-2xl font-semibold md:text-3xl">
                        {"Xin lỗi, mình không thể tìm thấy trang này."}
                    </p>
                    <p className="mt-4 mb-8 dark:text-gray-400">
                        Nhưng đừng lo, bạn có thể tìm thấy nhiều thứ khác trên trang chủ của mình.
                    </p>
                    <div className="flex gap-x-4 justify-center">
                        <Button >
                            <Link href={Route.index()}>Trang Chủ</Link>
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